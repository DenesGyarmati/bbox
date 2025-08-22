import { NextResponse } from "next/server";

interface CookieOptions {
  token: string;
  userName?: string;
  roleId?: string | number;
  expiresIn: number;
  userId?: number;
}
export function setAuthCookies(response: NextResponse, options: CookieOptions) {
  const { token, userName, roleId, expiresIn, userId } = options;

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn,
  });

  if (userName) {
    response.cookies.set({
      name: "user_name",
      value: userName,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });
  }

  if (roleId !== undefined) {
    response.cookies.set({
      name: "role_id",
      value: roleId.toString(),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });
  }

  response.cookies.set({
    name: "user_id",
    value: userId ? userId.toString() : "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn,
  });

  return response;
}
