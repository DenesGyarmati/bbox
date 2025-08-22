import { NextResponse } from "next/server";
import { apiPost } from "@/lib/api/axios";

export async function POST(
  req: Request,
  context: { params: { eventId: string } }
) {
  const { params } = context;
  const eventId = params.eventId;
  try {
    const body = await req.json();

    const data = await apiPost(`/reserve/${eventId}`, body);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Reservation error:", error);

    return NextResponse.json(
      { error: error?.response?.data || "Failed to make reservation" },
      { status: error?.response?.status || 500 }
    );
  }
}
