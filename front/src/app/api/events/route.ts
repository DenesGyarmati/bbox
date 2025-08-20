import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validation/eventSchema";
import { apiPost } from "@/lib/api/axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = eventSchema.parse(body);

    const data = await apiPost("/events", parsed);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Event creation error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: error?.response?.data || "Failed to create event" },
      { status: error?.response?.status || 500 }
    );
  }
}
