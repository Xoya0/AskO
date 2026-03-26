import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "api";
import { isProfane } from "@/lib/profanity";
import { isRateLimited } from "@/lib/rate-limit";
import { messaging } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();

    if (!username || !content) {
      return NextResponse.json(
        { error: "Username and content are required" },
        { status: 400 }
      );
    }

    if (isProfane(content)) {
      return NextResponse.json(
        { error: "Message contains prohibited content" },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get sender IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Check if IP is blocked
    if (user.blockedIps.includes(ip)) {
      return NextResponse.json(
        { error: "You are blocked from sending messages to this user." },
        { status: 403 }
      );
    }

    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const senderIpHash = Buffer.from(ip).toString("base64"); // Placeholder for actual hash

    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    const deviceInfo = userAgent.split(')')[0].split('(')[1] || "Mobile Device"; // Basic extraction
    const location = "New York, USA"; // Placeholder for Geo-IP lookup

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderIpHash,
        receiverId: user.id,
        deviceInfo,
        location,
      },
    });

    // Send push notification if token exists
    if (user.pushToken) {
        try {
          await messaging.send({
            token: user.pushToken,
            notification: {
              title: "New Anonymous Message! 💌",
              body: "Someone just sent you a message. Open the app to read it!",
            },
            data: {
              messageId: message.id,
              type: "new_message",
            },
          });
        } catch (error) {
          console.error("Error sending push notification:", error);
        }
    }

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
