"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/format";
import ReactPaginate from "react-paginate";

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

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();

    // 검색하면 페이지는 항상 1로 초기화
    setPage(1);
    const newPage = 1;

    // 검색어 없음 → 전체 목록 + URL에서 query 제거
    if (trimmed === "") {
      router.push("/inventory?page=1");

      const res = await fetch(`/inventory/api?page=${newPage}`, {
        method: "GET",
      });
      const { items, totalCount } = await res.json();

      setProducts(items);
      setTotalProuctCount(totalCount);
      return;
    }

    // 검색어 있음 → URL에 query 포함
    router.push(
      `/inventory?query=${encodeURIComponent(trimmed)}&page=${newPage}`
    );

    const res = await fetch(
      `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${newPage}`,
      {
        method: "GET",
      }
    );

    const { items, totalCount } = await res.json();

    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  async function handlePageChange(e: { selected: number }) {
    const newPage = e.selected + 1;
    setPage(newPage);

    // URL 업데이트
    const baseUrl = "/inventory";
    const queryString = query.trim()
      ? `?query=${encodeURIComponent(query.trim())}&page=${newPage}`
      : `?page=${newPage}`;

    router.push(baseUrl + queryString);

    // API 요청
    const apiUrl = query.trim()
      ? `/inventory/api?q=${encodeURIComponent(query.trim())}&page=${newPage}`
      : `/inventory/api?page=${newPage}`;

    const res = await fetch(apiUrl, { method: "GET" });
    const { items, totalCount } = await res.json();

    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  // 🗑 삭제
  async function handleDelete(id: string) {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    // 삭제 요청
    const res = await fetch(`/inventory/api?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Delete failed", res.status);
      return;
    }

    // ⭐ 현재 page와 query 유지한 채 다시 fetch
    const trimmed = query.trim();
    const apiUrl = trimmed
      ? `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${page}`
      : `/inventory/api?page=${page}`;

    // 최신 리스트 fetch
    const { items, totalCount } = await fetch(apiUrl).then((r) => r.json());

    // ⭐ 페이지가 비어있게 되면 이전 페이지로 이동
    if (items.length === 0 && page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);

      // URL 업데이트
      const url = trimmed
        ? `/inventory?query=${encodeURIComponent(trimmed)}&page=${prevPage}`
        : `/inventory?page=${prevPage}`;
      router.push(url);

      // 이전 페이지 데이터 다시 fetch
      const prevApiUrl = trimmed
        ? `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${prevPage}`
        : `/inventory/api?page=${prevPage}`;

      const prevRes = await fetch(prevApiUrl);
      const prevData = await prevRes.json();

      setProducts(prevData.items);
      setTotalProuctCount(prevData.totalCount);
      return;
    }

    // 기본 업데이트 (페이지가 정상인 경우)
    setProducts(items);
    setTotalProuctCount(totalCount);
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
            {products.map((product) => (
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
      <ReactPaginate
        previousLabel={<span className="flex items-center gap-1">‹ Prev</span>}
        nextLabel={<span className="flex items-center gap-1">Next ›</span>}
        breakLabel={"..."}
        pageCount={Math.ceil(totalPageCount / 10)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        forcePage={page - 1}
        containerClassName="flex items-center justify-center gap-1.5 mt-6 select-none"
        /* 페이지 번호 버튼 (統一된 크기) */
        pageClassName="
    min-w-[30px] h-7 
    flex items-center justify-center
    border border-gray-300 text-gray-700
    rounded-md bg-white
    hover:bg-gray-100 cursor-pointer transition text-sm
  "
        pageLinkClassName="outline-none"
        /* Prev / Next 동일 크기 */
        previousClassName="
    px-3 h-7 flex items-center justify-center
    border border-gray-300 text-gray-700
    rounded-md bg-white
    hover:bg-gray-100 cursor-pointer transition text-sm
  "
        nextClassName="
    px-3 h-7 flex items-center justify-center
    border border-gray-300 text-gray-700
    rounded-md bg-white
    hover:bg-gray-100 cursor-pointer transition text-sm
  "
        /* Active */
        activeClassName="!bg-purple-600 !text-white !border-purple-600"
        /* Disabled */
        disabledClassName="opacity-40 cursor-not-allowed"
        /* ... 표시 */
        breakClassName="px-2 text-gray-500 text-sm"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
