import { NextResponse } from "next/server";
import { requireStaffRole } from "@/lib/admin-access";
import { listCmsImageMediaOptions } from "@/lib/media-lib";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!requireStaffRole(session)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const options = await listCmsImageMediaOptions();
    return NextResponse.json(options);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}