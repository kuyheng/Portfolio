import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProjectsPayload = {
  projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    tech: string[];
    github: string;
    demo: string;
    image: string;
  }>;
  activityMessage?: string;
};

export async function GET() {
  const data = await readData();
  return NextResponse.json(
    { projects: data.projects },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<ProjectsPayload>;

  if (!Array.isArray(body.projects)) {
    return NextResponse.json({ error: "Invalid projects payload." }, { status: 400 });
  }

  const data = await readData();
  const now = new Date().toISOString();
  const next = {
    ...data,
    projects: body.projects,
    metrics: {
      ...data.metrics,
      lastUpdated: now,
    },
  };

  if (body.activityMessage) {
    next.activity = [
      {
        id: crypto.randomUUID(),
        message: body.activityMessage,
        timestamp: now,
      },
      ...data.activity,
    ].slice(0, 20);
  }

  await writeData(next);
  return NextResponse.json(
    { projects: next.projects },
    { headers: { "Cache-Control": "no-store" } }
  );
}
