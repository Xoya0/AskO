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
      // If username exists, update its deviceUuid to the current one
      // This allows users to "log in" or recover after a reinstall
      const updatedUser = await prisma.user.update({
        where: { id: existingUsername.id },
        data: { 
            deviceUuid,
            pushToken // Update push token as well
        },
      });
      return NextResponse.json(updatedUser);
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
