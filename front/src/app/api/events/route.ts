import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validation/eventSchema";
import { apiPost, apiGet } from "@/lib/api/axios";
import { EventEP } from "@/lib/api/ep";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error },
      { status: 422 }
    );
  }

  const { data, error, status } = await apiPost(EventEP.BASE, parsed.data);

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.data },
      { status: error.status ?? 500 }
    );
  }

  return NextResponse.json(data, { status: status ?? 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = new URLSearchParams({
    page: searchParams.get("page") ?? "1",
    per_page: searchParams.get("per_page") ?? "12",
    search: searchParams.get("search") ?? "",
    ...(searchParams.get("location")
      ? { location: searchParams.get("location")! }
      : {}),
    ...(searchParams.get("category")
      ? { category: searchParams.get("category")! }
      : {}),
  });

  const { data, error, status } = await apiGet(
    `${EventEP.BASE}?${query.toString()}`
  );

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.data },
      { status: error.status ?? 500 }
    );
  }

  return NextResponse.json(data, { status: status ?? 200 });
}
