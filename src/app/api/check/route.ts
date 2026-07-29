import { NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/analyze";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const text =
    body && typeof body === "object" && "text" in body
      ? (body as Record<string, unknown>).text
      : undefined;

  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Request body must include a non-empty 'text' string." },
      { status: 400 },
    );
  }

  try {
    const result = await analyzeMessage(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Analysis failed." },
      { status: 502 },
    );
  }
}
