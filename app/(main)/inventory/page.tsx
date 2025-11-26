import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { query: string; page: number };
}) {
  console.log(111111111111);
  const user = await getCurrentUser();
  const params = searchParams;
  const query = (params.query ?? "").trim();
  const rawPage = Number(params.page);
  const page = !rawPage || rawPage < 1 ? 1 : rawPage;

  const where = {
    userId: user.id,
    ...(query && {
      name: { contains: query, mode: "insensitive" as const },
    }),
  };

  const [data, totalProductCount] = await Promise.all([
    prisma.product.findMany({
      where,
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);
  const initialProducts = data.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Inventory</h2>
        <p className="text-sm text-gray-500">
          manage your product and track inventory levels
        </p>
      </div>

      <InventoryClient
        initialProducts={initialProducts}
        totalProductCount={totalProductCount}
        initPage={page}
        q={query}
      />
    </div>
  );
}
