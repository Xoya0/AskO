import { NextResponse } from "next/server";
import { prisma } from "api";

export async function POST(request: Request) {
  try {
    const { username, deviceUuid, pushToken } = await request.json();

    if (!username || !deviceUuid) {
      return NextResponse.json(
        { error: "Username and deviceUuid are required" },
        { status: 400 }
      );
    }

    // Check if user exists with this deviceUuid
    let user = await prisma.user.findUnique({
      where: { deviceUuid },
    });

    if (user) {
      // If user exists, but username is different, we might want to allow update or just return current
      // For now, let's just return the existing user
      return NextResponse.json(user);
    }

    // Check if username is taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        username,
        deviceUuid,
        pushToken
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Claim user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
