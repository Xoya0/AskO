import { NextResponse } from "next/server";
import { prisma } from "api";

export async function POST(request: Request) {
  try {
    const { messageId, blockSender, deviceUuid } = await request.json();

    if (!messageId || !deviceUuid) {
      return NextResponse.json(
        { error: "messageId and deviceUuid are required" },
        { status: 400 }
      );
    }

    // Find the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { receiver: true },
    });

    if (!message || message.receiver.deviceUuid !== deviceUuid) {
      return NextResponse.json(
        { error: "Message not found or unauthorized" },
        { status: 404 }
      );
    }

    // Flag as reported
    await prisma.message.update({
      where: { id: messageId },
      data: { isReported: true },
    });

    // Optionally block sender IP
    if (blockSender) {
        // In a real app, we'd add message.senderIpHash to user's blockedIps
        // For now, let's just log it or update the user model
        await prisma.user.update({
            where: { id: message.receiverId },
            data: {
                blockedIps: {
                    push: message.senderIpHash
                }
            }
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Report message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
    try {
      const { messageId, deviceUuid } = await request.json();
  
      if (!messageId || !deviceUuid) {
        return NextResponse.json(
          { error: "messageId and deviceUuid are required" },
          { status: 400 }
        );
      }
  
      // Find the message
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { receiver: true },
      });
  
      if (!message || message.receiver.deviceUuid !== deviceUuid) {
        return NextResponse.json(
          { error: "Message not found or unauthorized" },
          { status: 404 }
        );
      }
  
      // Delete message
      await prisma.message.delete({
        where: { id: messageId },
      });
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error("Delete message error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
