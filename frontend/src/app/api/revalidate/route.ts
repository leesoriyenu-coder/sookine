import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const path = searchParams.get("path") || "/";

    const configSecret = process.env.REVALIDATION_SECRET || "sookine-revalidate-secret-2026";

    if (secret !== configSecret) {
      return NextResponse.json({
        success: false,
        message: "유효하지 않은 시크릿 키입니다."
      }, { status: 401 });
    }

    revalidatePath(path);

    return NextResponse.json({
      success: true,
      revalidated: true,
      path,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || "캐시 무효화 중 오류 발생"
    }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
