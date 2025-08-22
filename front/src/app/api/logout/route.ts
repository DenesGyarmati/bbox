import { setAuthCookies } from "@/lib/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", "http://localhost:3000"));
  setAuthCookies(response, {
    token: "",
    userName: "",
    roleId: 0,
    expiresIn: 0,
    userId: 0,
  });

  return response;
}
