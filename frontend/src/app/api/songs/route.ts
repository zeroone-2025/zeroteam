import { NextResponse } from "next/server";
import { SONGS } from "@/lib/songs-data";

export async function GET() {
  return NextResponse.json(SONGS);
}
