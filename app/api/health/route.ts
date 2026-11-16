import { NextResponse } from "next/server";
import { runStatusCheck } from "@/lib/status-check";

export async function GET() {
  const result = await runStatusCheck();
  const statusCode = result.overall === "fail" ? 503 : 200;

  return NextResponse.json(
    {
      ok: result.overall !== "fail",
      overall: result.overall,
      checks: result.checks,
      generatedAt: result.generatedAt,
    },
    { status: statusCode }
  );
}
