import Sidebar from "@/component/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/format";
import { deleteProduct } from "@/lib/actions/products";
import DeleteButton from "@/component/delete-button";

export default async function InvertoryPage() {
  const user = await getCurrentUser();
  const userId = user.id;
  const totalProducts = await prisma.product.findMany({
    where: { userId },
  });
  const tableHeader = [
    { name: "Name", index: 0 },
    { name: "SKU", index: 1 },
    { name: "Price", index: 2 },
    { name: "Quantity", index: 3 },
    { name: "Low Stock At", index: 4 },
    { name: "Action", index: 5 },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory"></Sidebar>
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Inventory
              </h2>
              <p className="text-sm text-gray-500">
                manage your product and track inventory levels
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeader.map((table) => {
                    return (
                      <th
                        key={table.index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {table.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 ">
                {totalProducts.map(
                  (product: typeof totalProducts, key: number) => {
                    return (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {product.sku || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatNumber(product.price)}$
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatNumber(product.quantity)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatNumber(product.lowStockAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <DeleteButton id={product.id} />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
