import Sidebar from "@/component/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const query = (params.query ?? "").trim();

  const data = await prisma.product.findMany({
    where: { userId: user.id, name: { contains: query, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

  const initialProducts = data.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500">
            manage your product and track inventory levels
          </p>
        </div>

        <InventoryClient initialProducts={initialProducts} q={query} />
      </main>
    </div>
  );
}
