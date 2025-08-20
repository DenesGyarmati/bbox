import { NextResponse } from "next/server";
import { apiPatch } from "@/lib/api/axios";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const { params } = await context;
    const userId = params.id;

    const body = await req.json();
    const { is_active } = body;

    const data = await apiPatch(`/users/${userId}/activate`, { is_active });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { error: error?.response?.data || "Failed to toggle user status" },
      { status: error?.response?.status || 500 }
    );
  }
}
