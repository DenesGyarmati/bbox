import { NextResponse } from "next/server";
import { apiPatch } from "@/lib/api/axios";
import { AdminEP } from "@/lib/api/ep";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { params } = await context;
  const userId = params.id;

  const body = await req.json();
  const { is_active } = body;

  const { data, status, error } = await apiPatch(
    `${AdminEP.USERS}/${userId}${AdminEP.ACTIVATE}`,
    {
      is_active,
    }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message, defaults: error.data },
      { status: error.status }
    );
  }
  return NextResponse.json(data, { status });
}
