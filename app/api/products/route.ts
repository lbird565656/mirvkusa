import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        { category: "asc" },
        { featuredOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return Response.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return new Response("Error fetching products", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        category: body.category,
        imageUrl: body.imageUrl || null,
        isAvailable: true,
        isFeatured: Boolean(body.isFeatured),
        featuredOrder: Number(body.featuredOrder || 0),
      },
    });

    return Response.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return new Response("Error creating product", { status: 500 });
  }
}