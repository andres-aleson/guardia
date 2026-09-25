import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rows } = await getDb().query<{ schema: string }>(
      "select current_schema() as schema",
    );
    return NextResponse.json({ ok: true, schema: rows[0].schema });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
