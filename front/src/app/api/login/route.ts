import { NextResponse } from "next/server";
import axios from "axios";
import { AuthEP } from "@/lib/api/ep";
import { setAuthCookies } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${AuthEP.LOGIN}`,
      body,
      {
        withCredentials: true,
      }
    );

    const response = NextResponse.json({ success: true, user: data.user });
    setAuthCookies(response, {
      token: data.access_token,
      userName: data.user.name,
      roleId: data.user.role_id,
      expiresIn: data.expires_in,
      userId: data.user.id,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data?.error || "Server error" },
      { status: 500 }
    );
  }
}
