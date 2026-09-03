import { NextResponse } from "next/server";
import { getWilayas } from "@/lib/data";

export async function GET() {
  const wilayas = await getWilayas();
  return NextResponse.json({ wilayas });
}
