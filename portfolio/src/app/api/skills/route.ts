import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function GET(request: Request) {
  const res = await fetch(`${API_BASE}/api/skills`, {
    headers: {
      Authorization: request.headers.get("authorization") || "",
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const res = await fetch(`${API_BASE}/api/skills`, {
    method: "PUT",
    headers: {
      Authorization: request.headers.get("authorization") || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
