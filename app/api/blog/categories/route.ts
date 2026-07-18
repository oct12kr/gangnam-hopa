import { NextResponse } from "next/server";
import { fetchWordPressJson, getWordPressErrorPayload } from "@/lib/wordpress-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchWordPressJson("categories", {
      hide_empty: true,
      orderby: "count",
      order: "desc",
      per_page: 100,
    });

    return NextResponse.json({
      categories: result.data,
      totalPages: result.totalPages,
      total: result.total,
    });
  } catch (error) {
    const payload = getWordPressErrorPayload(error);
    return NextResponse.json(payload.body, { status: payload.status });
  }
}
