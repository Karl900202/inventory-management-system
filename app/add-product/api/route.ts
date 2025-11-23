import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

// Product 유효성 검사 스키마
const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

/* ---------------------------------------------
 *  POST => 상품 등록
 * -------------------------------------------*/
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    // body JSON 파싱
    const body = await req.json();

    // Zod 유효성 검사
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
      });
    }

    // 데이터 생성
    await prisma.product.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
