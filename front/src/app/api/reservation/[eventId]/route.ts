import { NextResponse } from "next/server";
import { apiPost } from "@/lib/api/axios";
import { ResEP } from "@/lib/api/ep";

export async function POST(
  req: Request,
  context: { params: { eventId: string } }
) {
  const { params } = context;
  const eventId = params.eventId;

  const body = await req.json();
  const { data, status, error } = await apiPost(`${ResEP}${eventId}`, body);

  if (error) {
    return NextResponse.json(
      { error: error.message, defaults: error.data },
      { status: error.status ?? 500 }
    );
  }

  return NextResponse.json(data, { status: status ?? 200 });
}
