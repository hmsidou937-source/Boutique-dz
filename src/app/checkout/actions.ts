"use server";

import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail, sendOrderConfirmationWhatsApp } from "@/lib/notifications";
import type { DeliveryMethod, OrderItemInput } from "@/lib/types";

export interface CreateOrderInput {
  fullName: string;
  phone: string;
  email?: string;
  wilayaId: number;
  communeId: string;
  address: string;
  notes: string;
  deliveryMethod: DeliveryMethod;
  items: OrderItemInput[];
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!input.fullName || !input.phone || !input.wilayaId || !input.communeId || input.items.length === 0) {
    return { success: false, error: "missing_fields" };
  }
  if (!/^0[5-7][0-9]{8}$/.test(input.phone.replace(/\s/g, ""))) {
    return { success: false, error: "invalid_phone" };
  }

  const supabase = createClient();

  // Delivery price is always looked up server-side from the commune the
  // shopper picked — the client never gets to submit its own price.
  const { data: commune, error: communeError } = await supabase
    .from("communes")
    .select("home_price, office_price, wilaya_id")
    .eq("id", input.communeId)
    .single();

  if (communeError || !commune || commune.wilaya_id !== input.wilayaId) {
    return { success: false, error: "invalid_location" };
  }

  const deliveryPrice = input.deliveryMethod === "home" ? commune.home_price : commune.office_price;
  const subtotal = input.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const total = subtotal + deliveryPrice;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      full_name: input.fullName,
      phone: input.phone,
      wilaya_id: input.wilayaId,
      commune_id: input.communeId,
      address: input.address,
      notes: input.notes,
      delivery_method: input.deliveryMethod,
      delivery_price: deliveryPrice,
      subtotal,
      total,
      payment_method: "cod",
      status: "new",
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { success: false, error: "order_failed" };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      color: item.color ?? null,
      size: item.size ?? null,
    }))
  );

  if (itemsError) {
    return { success: false, error: "items_failed" };
  }

  // Fire-and-forget: notifications never block or fail the checkout.
  // Both helpers are no-ops if their env vars aren't configured.
  void sendOrderConfirmationEmail({
    orderNumber: order.order_number,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    total,
    items: input.items,
  });
  void sendOrderConfirmationWhatsApp({
    orderNumber: order.order_number,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    total,
    items: input.items,
  });

  return { success: true, orderNumber: order.order_number };
}
