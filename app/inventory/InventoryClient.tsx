"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";

export type Product = {
  id: string;
  name: string;
  userId: string;
  sku: string | null;
  price: number;
  quantity: number;
  lowStockAt: number | null;
  createdAt: string;
  updatedAt: string;
};

export default function InventoryClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/inventory/api?q=${query}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Search failed", res.status);
      return;
    }

    const data = await res.json();
    setProducts(data);
  }

  // 🗑 삭제
  async function handleDelete(id: string) {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    const res = await fetch(`/inventory/api?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Delete failed", res.status);
      return;
    }

    // 삭제 후 리스트 재요청
    const updated = await fetch(`/inventory/api`).then((r) => r.json());
    setProducts(updated);
  }

  const tableHeader = [
    "Name",
    "SKU",
    "Price",
    "Quantity",
    "Low Stock At",
    "Action",
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
          />
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {tableHeader.map((name, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: Product) => (
              <tr key={product.id} className="hover:bg-gray-50 text-center">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.sku || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatNumber(Number(product.price))}$
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatNumber(product.quantity)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatNumber(Number(product.lowStockAt))}
                </td>
                <td className="px-6 py-4 text-sm text-red-600 hover:text-red-900">
                  <button onClick={() => handleDelete(product.id)}>
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
