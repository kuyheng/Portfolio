import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetricKey = "cvDownloads" | "profileViews";
type MetricsDelta = Partial<Record<MetricKey, number>>;

type ProfilePayload = {
  profile?: Partial<{
    name: string;
    role: string;
    location: string;
    bio: string;
    email: string;
    photo: string;
    socials: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }>;
  hero?: Partial<{
    roles: string[];
    cta: {
      primary?: string;
      secondary?: string;
    };
  }>;
  stats?: Array<{ label: string; value: number; suffix?: string }>;
  cvUrl?: string;
  cvUpdatedAt?: string;
  metrics?: Partial<{
    cvDownloads: number;
    profileViews: number;
    lastUpdated: string;
  }>;
  metricsDelta?: MetricsDelta;
  activityMessage?: string;
  touchLastUpdated?: boolean;
};

export async function GET() {
  const data = await readData();
  return NextResponse.json(
    {
      profile: data.profile,
      hero: data.hero,
      stats: data.stats,
      cvUrl: data.cvUrl,
      cvUpdatedAt: data.cvUpdatedAt,
      activity: data.activity,
      metrics: data.metrics,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ProfilePayload;
  const data = await readData();
  const now = new Date().toISOString();

  const next = { ...data };

  if (body.profile) {
    next.profile = {
      ...data.profile,
      ...body.profile,
      socials: {
        ...data.profile.socials,
        ...(body.profile.socials ?? {}),
      },
    };
  }

  if (body.hero) {
    next.hero = {
      ...data.hero,
      ...body.hero,
      cta: {
        ...data.hero.cta,
        ...(body.hero.cta ?? {}),
      },
    };
  }

  if (body.stats) {
    next.stats = body.stats.map((stat) => ({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix ?? "",
    }));
  }

  if (typeof body.cvUrl === "string") {
    next.cvUrl = body.cvUrl;
  }

  if (typeof body.cvUpdatedAt === "string") {
    next.cvUpdatedAt = body.cvUpdatedAt;
  }

  if (body.metrics) {
    next.metrics = {
      ...data.metrics,
      ...body.metrics,
    };
  }

  if (body.metricsDelta) {
    next.metrics = { ...next.metrics };
    for (const [key, value] of Object.entries(body.metricsDelta)) {
      if (typeof value === "number") {
        const typedKey = key as MetricKey;
        const current = typeof next.metrics[typedKey] === "number" ? next.metrics[typedKey] : 0;
        next.metrics[typedKey] = current + value;
      }
    }
  }

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

  const shouldTouch =
    body.touchLastUpdated ||
    !!body.profile ||
    !!body.hero ||
    !!body.stats ||
    typeof body.cvUrl === "string" ||
    typeof body.cvUpdatedAt === "string" ||
    !!body.activityMessage;

  if (shouldTouch) {
    next.metrics = {
      ...next.metrics,
      lastUpdated: now,
    };
  }

  await writeData(next);
  return NextResponse.json(
    {
      profile: next.profile,
      hero: next.hero,
      stats: next.stats,
      cvUrl: next.cvUrl,
      cvUpdatedAt: next.cvUpdatedAt,
      activity: next.activity,
      metrics: next.metrics,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
