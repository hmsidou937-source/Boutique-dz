export type Locale = "ar" | "fr";

export interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
}

export interface ProductSpec {
  label_ar: string;
  label_fr: string;
  value_ar: string;
  value_fr: string;
}

export interface Product {
  id: string;
  sku: string | null;
  name_ar: string;
  name_fr: string;
  slug: string;
  description_ar: string | null;
  description_fr: string | null;
  specs: ProductSpec[];
  category_id: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  colors: string[];
  sizes: string[];
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  rating_count: number;
  created_at: string;
}

export interface Wilaya {
  id: number;
  code: string;
  name_ar: string;
  name_fr: string;
}

export interface Commune {
  id: string;
  wilaya_id: number;
  name_ar: string;
  name_fr: string;
  home_price: number;
  office_price: number;
  delivery_days_min: number;
  delivery_days_max: number;
  carrier: string | null;
  is_active: boolean;
}

export type OrderStatus =
  | "new"
  | "confirming"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "returned";

export type DeliveryMethod = "home" | "office";

export interface OrderItemInput {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  order_number: string;
  full_name: string;
  phone: string;
  wilaya_id: number;
  commune_id: string;
  address: string | null;
  notes: string | null;
  delivery_method: DeliveryMethod;
  delivery_price: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  currency: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  delivery_policy_ar: string | null;
  delivery_policy_fr: string | null;
  return_policy_ar: string | null;
  return_policy_fr: string | null;
  privacy_policy_ar: string | null;
  privacy_policy_fr: string | null;
  meta_pixel_id: string | null;
  tiktok_pixel_id: string | null;
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
}
