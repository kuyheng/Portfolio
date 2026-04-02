import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function GET(request: Request) {
  const res = await fetch(`${API_BASE}/api/profile`, {
    headers: {
      Authorization: request.headers.get("authorization") || "",
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let body: BodyInit;
  const headers: Record<string, string> = {
    Authorization: request.headers.get("authorization") || "",
  };

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    body = formData;
  } else {
    const json = await request.json();
    body = JSON.stringify(json);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "PUT",
    headers,
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
