import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const status = body.status as OrderStatus;

    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: "Некорректный статус заказа" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);

    return NextResponse.json(
      { error: "Ошибка при обновлении статуса заказа" },
      { status: 500 }
    );
  }
}