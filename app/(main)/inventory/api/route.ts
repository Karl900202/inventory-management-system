import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1), // 필수 X (업데이트니까)
  price: z.coerce.number().min(0), // coerce: "123" → 123 숫자 변환
  quantity: z.coerce.number().min(0),
  sku: z.string().optional().nullable(),
  lowStockAt: z.coerce.number().min(0).optional().nullable(),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();

  const json = await req.json();

  // ⭐ Zod 유효성 체크
  const parsed = updateProductSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
    });
  }

  const { id, name, price, quantity, sku, lowStockAt } = parsed.data;

  // ⭐ 업데이트
  const updated = await prisma.product.updateMany({
    where: { id, userId: user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(quantity !== undefined && { quantity }),
      ...(sku !== undefined && { sku }),
      ...(lowStockAt !== undefined && { lowStockAt }),
    },
  });

  return Response.json({ updated });
}
/* GET => 검색 */
export async function GET(req: Request) {
  // 현재 로그인된 사용자 가져오기
  const user = await getCurrentUser();
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = 10;

  // ⭐ 검색 조건 기반 totalCount
  const totalCount = await prisma.product.count({
    where: {
      userId: user.id,
      name: { contains: q, mode: "insensitive" },
    },
  });

  // ⭐ 페이지네이션 적용
  const list = await prisma.product.findMany({
    where: {
      userId: user.id,
      name: { contains: q, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const items = list.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return Response.json({
    items,
    totalCount,
  });
}

/* DELETE => 삭제 */
export async function DELETE(req: Request) {
  // 현재 로그인된 사용자 가져오기
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
