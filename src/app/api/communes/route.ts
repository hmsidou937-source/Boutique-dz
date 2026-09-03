import { NextRequest, NextResponse } from "next/server";
import { getCommunesByWilaya } from "@/lib/data";

export async function GET(req: NextRequest) {
  const wilayaId = req.nextUrl.searchParams.get("wilayaId");
  if (!wilayaId) return NextResponse.json({ communes: [] });
  const communes = await getCommunesByWilaya(Number(wilayaId));
  return NextResponse.json({ communes });
}
