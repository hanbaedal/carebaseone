import { NextResponse } from "next/server";
import { isUsernameTaken } from "@/lib/members";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = String(searchParams.get("username") ?? "").trim();
  if (!username) {
    return NextResponse.json({ available: false });
  }
  const taken = await isUsernameTaken(username);
  return NextResponse.json({ available: !taken });
}
