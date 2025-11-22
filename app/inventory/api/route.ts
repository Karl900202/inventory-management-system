import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function getUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/* GET => 검색 */
export async function GET(req: Request) {
  // 현재 로그인된 사용자 가져오기
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
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
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
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
