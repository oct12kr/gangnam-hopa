import { NextRequest, NextResponse } from "next/server";
import { fetchWordPressJson, getWordPressErrorPayload, resolveCategoryId } from "@/lib/wordpress-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "12";
  const category = searchParams.get("category");

  try {
    const categoryId = category ? await resolveCategoryId(category) : undefined;
    const result = await fetchWordPressJson("posts", {
      _embed: true,
      page,
      per_page: perPage,
      categories: categoryId,
    });

    return NextResponse.json({
      posts: result.data,
      totalPages: result.totalPages,
      total: result.total,
    });
  } catch (error) {
    const payload = getWordPressErrorPayload(error);
    return NextResponse.json(payload.body, { status: payload.status });
  }
}
