import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "api";

export async function GET(request: Request) {
  try {
    const deviceUuid = request.headers.get("x-device-uuid");

    if (!deviceUuid) {
      return NextResponse.json(
        { error: "x-device-uuid header is required" },
        { status: 400 }
      );
    }

    // Find the user by deviceUuid
    const user = await prisma.user.findUnique({
      where: { deviceUuid },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ messages: user.messages, isPro: user.isPro });
  } catch (error: any) {
    console.error("Get inbox error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
