import { NextResponse } from "next/server";
import axios from "axios";
import { AuthEP } from "@/lib/api/ep";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${AuthEP.REGISTER}`,
      body,
      {
        withCredentials: true,
      }
    );

    const token = data.access_token;

    const response = NextResponse.json({ success: true, user: data.user });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in,
    });
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err || "Registration failed" },
      { status: 422 }
    );
  }
}
