import { NextResponse } from "next/server";
import axios from "@/lib/api/axios";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { is_active } = body;

    const response = await axios.post(`/users/${params.id}`, { is_active });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Proxy error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to toggle user status" },
      { status: error.response?.status || 500 }
    );
  }
}
