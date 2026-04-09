import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        category: body.category,
        imageUrl: body.imageUrl || null,
        isAvailable: Boolean(body.isAvailable),
        isFeatured: Boolean(body.isFeatured),
        featuredOrder: Number(body.featuredOrder || 0),
      },
    });

    return Response.json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    return new Response("Error updating product", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.product.delete({
      where: { id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return new Response("Error deleting product", { status: 500 });
  }
}