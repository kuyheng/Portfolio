import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SkillsPayload = {
  skills: Record<string, Array<{ name: string; icon: string }>>;
  activityMessage?: string;
};

export async function GET() {
  const data = await readData();
  return NextResponse.json(
    { skills: data.skills },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<SkillsPayload>;

  if (!body.skills || typeof body.skills !== "object") {
    return NextResponse.json({ error: "Invalid skills payload." }, { status: 400 });
  }

  const data = await readData();
  const now = new Date().toISOString();
  const next = {
    ...data,
    skills: body.skills,
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
    { skills: next.skills },
    { headers: { "Cache-Control": "no-store" } }
  );
}
