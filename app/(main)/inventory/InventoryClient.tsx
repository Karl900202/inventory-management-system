"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import UpdateProductModal from "./_components/UpdateProductModal";
import { formatNumber, formatUSD } from "@/lib/format";

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
  totalProductCount,
  initPage,
  q,
}: {
  initialProducts: Product[];
  totalProductCount: number;
  initPage: number;
  q: string;
}) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState(q);
  const [page, setPage] = useState(initPage);
  const [totalPageCount, setTotalProuctCount] = useState(totalProductCount);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  /** ESC 모달 닫기 */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setEditingProduct(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const fetchProducts = useCallback(async (q: string, page: number) => {
    const trimmed = q.trim();

    const apiUrl = trimmed
      ? `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${page}`
      : `/inventory/api?page=${page}`;

    const res = await fetch(apiUrl);
    return res.json();
  }, []);
  /** UPDATE 성공 */
  async function handleUpdateSuccess() {
    // 1. 모달 닫기
    setEditingProduct(null);

    // 2. 최신 리스트 가져오기
    const trimmed = query.trim();
    const { items, totalCount } = await fetchProducts(trimmed, page);

    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  const updateUrl = useCallback(
    (q: string, page: number) => {
      const trimmed = q.trim();

      const url = trimmed
        ? `/inventory?query=${encodeURIComponent(trimmed)}&page=${page}`
        : `/inventory?page=${page}`;

      router.push(url);
    },
    [router]
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    const newPage = 1;

    updateUrl(trimmed, newPage);
    const { items, totalCount } = await fetchProducts(trimmed, newPage);

    setPage(newPage);
    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  async function handlePageChange(e: { selected: number }) {
    const newPage = e.selected + 1;
    const trimmed = query.trim();

    setPage(newPage);
    updateUrl(trimmed, newPage);

    const { items, totalCount } = await fetchProducts(trimmed, newPage);

    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  async function handleDelete(id: string) {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    const res = await fetch(`/inventory/api?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Delete failed");
      return;
    }

    const trimmed = query.trim();
    const { items, totalCount } = await fetchProducts(trimmed, page);

    if (items.length === 0 && page > 1) {
      const prevPage = page - 1;

      setPage(prevPage);
      updateUrl(trimmed, prevPage);

      const prevData = await fetchProducts(trimmed, prevPage);
      setProducts(prevData.items);
      setTotalProuctCount(prevData.totalCount);
      return;
    }

    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  const tableHeader = useMemo(
    () => ["Name", "SKU", "Price", "Quantity", "Low Stock At", "Action"],
    []
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500"
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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 text-center">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.sku || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatUSD(product.price)}$
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatNumber(product.quantity)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatNumber(Number(product.lowStockAt))}
                </td>

                {/* UPDATE 버튼 → 모달 열기 */}
                <td className="flex justify-center px-6 py-4">
                  <button
                    className="bg-white border border-gray-200 rounded-lg p-2 text-sm text-blue-600 hover:text-blue-900"
                    onClick={() => setEditingProduct(product)}
                  >
                    update
                  </button>

                  <button
                    className="bg-white border border-gray-200 rounded-lg p-2 text-sm text-red-600 hover:text-red-900 ml-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <ReactPaginate
          previousLabel={
            <span className="flex items-center hover:text-gray-500 gap-2">
              Prev
            </span>
          }
          nextLabel={
            <span className="flex items-center hover:text-gray-500 gap-2">
              Next
            </span>
          }
          breakLabel={"..."}
          pageCount={Math.ceil(totalPageCount / 10)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName="flex items-center justify-center gap-1.5 select-none"
          pageClassName="
            min-w-[30px] h-7 
            flex items-center justify-center
            border border-gray-300 text-gray-700
            rounded-md bg-white
            hover:bg-gray-100 cursor-pointer transition text-sm
          "
          activeClassName="!bg-purple-600 !text-white !border-purple-600"
          disabledClassName="opacity-40 cursor-not-allowed"
        />
      </div>

      {editingProduct && (
        <UpdateProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={() => {
            handleUpdateSuccess();
          }}
        />
      )}
    </div>
  );
}
