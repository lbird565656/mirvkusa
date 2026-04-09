import { prisma } from "@/lib/prisma";

function validateName(name: unknown) {
  if (typeof name !== "string") return "Некорректное имя";
  const value = name.trim();

  if (!value) return "Имя обязательно";
  if (value.length < 2) return "Имя слишком короткое";
  if (value.length > 60) return "Имя слишком длинное";
  if (!/^[A-Za-zА-Яа-яЁё\s'-]+$/.test(value)) {
    return "Имя должно содержать только буквы";
  }

  return "";
}

function validatePhone(phone: unknown) {
  if (typeof phone !== "string") return "Некорректный телефон";
  if (!/^7\d{10}$/.test(phone)) return "Некорректный телефон";
  return "";
}

function validateAddress(address: unknown, fulfillmentType: unknown) {
  if (fulfillmentType === "PICKUP") return "";

  if (typeof address !== "string") return "Некорректный адрес";
  const value = address.trim();

  if (!value) return "Адрес обязателен";
  if (value.length < 8) return "Адрес слишком короткий";
  if (value.length > 160) return "Адрес слишком длинный";

  return "";
}

function validateItems(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Корзина пустая";
  }

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      typeof item.quantity !== "number"
    ) {
      return "Некорректный состав заказа";
    }

    if (!item.name.trim()) return "Некорректное название товара";
    if (item.price <= 0) return "Некорректная цена товара";
    if (item.quantity <= 0) return "Некорректное количество товара";
  }

  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nameError = validateName(body.name);
    const phoneError = validatePhone(body.phone);
    const addressError = validateAddress(body.address, body.fulfillmentType);
    const itemsError = validateItems(body.items);

    const total = Array.isArray(body.items)
      ? body.items.reduce(
          (sum: number, item: { price: number; quantity: number }) =>
            sum + item.price * item.quantity,
          0
        )
      : 0;

    if (nameError) return new Response(nameError, { status: 400 });
    if (phoneError) return new Response(phoneError, { status: 400 });
    if (addressError) return new Response(addressError, { status: 400 });
    if (itemsError) return new Response(itemsError, { status: 400 });

    if (typeof body.orderNumber !== "string" || !/^\d{6}$/.test(body.orderNumber)) {
      return new Response("Некорректный номер заказа", { status: 400 });
    }

    if (body.fulfillmentType !== "DELIVERY" && body.fulfillmentType !== "PICKUP") {
      return new Response("Некорректный способ получения", { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        customerName: body.name.trim(),
        phone: body.phone,
        fulfillmentType: body.fulfillmentType,
        address:
          body.fulfillmentType === "DELIVERY" && typeof body.address === "string"
            ? body.address.trim()
            : null,
        comment:
          typeof body.comment === "string" && body.comment.trim()
            ? body.comment.trim()
            : null,
        totalAmount: total,
        items: {
          create: body.items.map(
            (item: { name: string; price: number; quantity: number }) => ({
              nameSnapshot: item.name.trim(),
              priceSnapshot: item.price,
              quantity: item.quantity,
            })
          ),
        },
      },
      include: {
        items: true,
      },
    });

    return Response.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    return new Response("Ошибка создания заказа", { status: 500 });
  }
}