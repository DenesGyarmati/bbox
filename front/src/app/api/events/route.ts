import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validation/eventSchema";
import { apiPost, apiGet } from "@/lib/api/axios";

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

export async function GET(req: Request) {
  try {
    // Extract query params from request URL
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "12";
    const search = searchParams.get("search") || "";

    // Forward the query params to your backend API
    const { data, error } = await apiGet(
      `/events?page=${page}&per_page=${perPage}&search=${encodeURIComponent(
        search
      )}`
    );

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error.data },
        { status: error.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Event fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
