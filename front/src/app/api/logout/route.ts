import { setAuthCookies } from "@/lib/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  setAuthCookies(response, {
    token: "",
    userName: "",
    roleId: 0,
    expiresIn: 0,
    userId: 0,
  });

  return response;
}
