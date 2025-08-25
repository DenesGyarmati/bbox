import { apiPut, apiPatch } from "@/lib/api/axios";
import { EventEP } from "@/lib/api/ep";
import { eventSchema } from "@/lib/validation/eventSchema";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { eventId: string } }
) {
  const { eventId } = context.params;
  const body = await req.json();

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error },
      { status: 422 }
    );
  }

  const { data, error, status } = await apiPut(
    `${EventEP.BASE}/${eventId}`,
    parsed.data
  );

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.data },
      { status: error.status ?? 500 }
    );
  }

  return NextResponse.json(data, { status: status ?? 200 });
}

export async function PATCH(
  req: Request,
  context: { params: { eventId: string } }
) {
  const { eventId } = context.params;
  const body = await req.json();

  const status = body?.status;
  const validStatuses = ["draft", "published", "cancelled"];

  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  const {
    data,
    error,
    status: resStatus,
  } = await apiPatch(`${EventEP.BASE}/${eventId}${EventEP.STATUS}`, { status });

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.data },
      { status: error.status ?? 500 }
    );
  }

  return NextResponse.json(data, { status: resStatus ?? 200 });
}
