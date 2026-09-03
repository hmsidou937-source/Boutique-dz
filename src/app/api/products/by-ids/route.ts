import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  if (!idsParam) return NextResponse.json({ products: [] });

  const ids = idsParam.split(",").filter(Boolean);
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*").in("id", ids).eq("is_active", true);

  return NextResponse.json({ products: data ?? [] });
}
