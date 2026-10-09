import { NextResponse } from "next/server";

export function GET() {
  // Return an empty 204 so /favicon.ico doesn't fall through to [locale]
  return new NextResponse(null, { status: 204 });
}
