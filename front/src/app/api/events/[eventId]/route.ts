import { apiPut } from "@/lib/api/axios";
import { eventSchema } from "@/lib/validation/eventSchema";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { eventId: string } }
) {
  const { params } = context;
  const eventId = params.eventId;
  try {
    const body = await req.json();

    const parsed = eventSchema.parse(body);

    const data = await apiPut(`/events/${eventId}`, parsed);

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: error?.response?.data || "Failed to update event" },
      { status: error?.response?.status || 500 }
    );
  }
}
