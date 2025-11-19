import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* GET => 검색 */
export async function GET(req: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const list = await prisma.product.findMany({
    where: {
      userId: user.id,
      name: { contains: q, mode: "insensitive" },
    },
  });

  const json = list.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return Response.json(json);
}

/* DELETE => 삭제 */
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  await prisma.product.deleteMany({
    where: { id, userId: user.id },
  });

  return new Response("OK");
}
