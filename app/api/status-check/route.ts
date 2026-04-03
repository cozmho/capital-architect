import { NextResponse } from "next/server";
import { runStatusCheck } from "@/lib/status-check";

export async function GET() {
  const result = await runStatusCheck();
  const statusCode = result.overall === "fail" ? 503 : 200;

  return NextResponse.json(result, { status: statusCode });
}
