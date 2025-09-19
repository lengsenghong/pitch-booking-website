import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear cookie by setting empty value + expired
  res.cookies.set("fp_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
