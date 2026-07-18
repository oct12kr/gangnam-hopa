import { NextRequest, NextResponse } from "next/server";
import { fetchWordPressJson, getWordPressErrorPayload } from "@/lib/wordpress-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  try {
    const result = await fetchWordPressJson("posts", {
      _embed: true,
      slug: decodeURIComponent(slug),
      per_page: 1,
    });

    const posts = Array.isArray(result.data) ? result.data : [];

    return NextResponse.json({
      post: posts[0] ?? null,
      totalPages: result.totalPages,
      total: result.total,
    });
  } catch (error) {
    const payload = getWordPressErrorPayload(error);
    return NextResponse.json({ ...payload.body, post: null }, { status: payload.status });
  }
}
