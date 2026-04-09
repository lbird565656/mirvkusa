import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const latestOrder = await prisma.order.findFirst({
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        status: true,
      },
    });

    return NextResponse.json({
      latestOrder: latestOrder
        ? {
            id: latestOrder.id,
            orderNumber: latestOrder.orderNumber,
            createdAt: latestOrder.createdAt.toISOString(),
            status: latestOrder.status,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to fetch latest order:", error);

    return NextResponse.json(
      { error: "Failed to fetch latest order" },
      { status: 500 }
    );
  }
}