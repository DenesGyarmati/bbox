import { setAuthCookies } from "@/lib/cookies";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL("/", req.url);
  const response = NextResponse.redirect(url);
  setAuthCookies(response, {
    token: "",
    userName: "",
    roleId: 0,
    expiresIn: 0,
    userId: 0,
  });

  return response;
}
