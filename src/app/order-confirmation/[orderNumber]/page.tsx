import { getOrderByNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrderByNumber(params.orderNumber);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
      <h1 className="text-2xl font-bold text-ink-900">تم تسجيل طلبك بنجاح 🎉</h1>
      <p className="mt-1 text-ink-800/60">Votre commande a été enregistrée avec succès</p>

      <div className="mt-6 rounded-xl border border-black/5 bg-white p-4 text-start">
        <div className="flex justify-between border-b border-black/5 pb-3">
          <span className="text-sm text-ink-800/60">رقم الطلب / N° commande</span>
          <span className="font-bold text-brand-700">{order.order_number}</span>
        </div>

        <div className="space-y-2 py-3">
          {order.order_items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product_name} × {item.quantity}</span>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 border-t border-black/5 pt-3 text-sm">
          <div className="flex justify-between text-ink-800/70">
            <span>المجموع / Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-800/70">
            <span>التوصيل / Livraison</span>
            <span>{formatPrice(order.delivery_price)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-ink-900">
            <span>الإجمالي / Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-3 space-y-1 border-t border-black/5 pt-3 text-sm text-ink-800/70">
          <p>{order.full_name} — {order.phone}</p>
          <p>{order.wilayas?.name_ar}, {order.communes?.name_ar}</p>
          <p>{order.delivery_method === "home" ? "توصيل إلى المنزل / Domicile" : "توصيل إلى المكتب / Bureau"}</p>
        </div>
      </div>

      <Link href="/products" className="mt-6 inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white">
        متابعة التسوق / Continuer les achats
      </Link>
    </div>
  );
}
