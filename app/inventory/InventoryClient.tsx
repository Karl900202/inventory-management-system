"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
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

  /**
   * 모든 state는 최초 렌더링에 한 번만 실행됨.
   * 이후 Input을 입력하거나 페이지를 바꿔도 이 부분은 다시 실행되지 않는다.
   */
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState(q);
  const [page, setPage] = useState(initPage);
  const [totalPageCount, setTotalProuctCount] = useState(totalProductCount);

  /**
   * 공통 fetch 함수
   * - 검색어, 페이지 등을 받아 API 호출
   * - fetch 중복 제거
   */
  const fetchProducts = useCallback(async (q: string, page: number) => {
    const trimmed = q.trim();

    const apiUrl = trimmed
      ? `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${page}`
      : `/inventory/api?page=${page}`;

    const res = await fetch(apiUrl);
    return res.json();
  }, []);

  /**
   * URL 업데이트 공통 함수
   * push 로직 중복 제거 (검색 / 페이지 변경 모두 사용)
   */
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

  /**
   * 검색 기능
   * - Enter 또는 Search 버튼 클릭 시 실행
   * - 검색 시 항상 page = 1로 초기화
   */
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    const newPage = 1;

    // URL 업데이트
    updateUrl(trimmed, newPage);

    // API 요청
    const { items, totalCount } = await fetchProducts(trimmed, newPage);

    // 상태 업데이트
    setPage(newPage);
    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  /**
   *  페이지네이션 변경
   */
  async function handlePageChange(e: { selected: number }) {
    const newPage = e.selected + 1;
    const trimmed = query.trim();

    // page 업데이트
    setPage(newPage);

    // URL 업데이트
    updateUrl(trimmed, newPage);

    // API 요청
    const { items, totalCount } = await fetchProducts(trimmed, newPage);

    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  /**
   * 삭제 기능
   * - 삭제 후 현재 페이지가 비면 자동으로 이전 페이지로 이동
   * - 삭제 이후에도 검색어/페이지 상태 유지
   */
  async function handleDelete(id: string) {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    // DELETE 요청
    const res = await fetch(`/inventory/api?id=${id}`, { method: "DELETE" });

    if (!res.ok) {
      console.error("Delete failed");
      return;
    }

    const trimmed = query.trim();

    // 삭제 후 현재 페이지 데이터 다시 fetch
    const { items, totalCount } = await fetchProducts(trimmed, page);

    // 현재 페이지가 비었으면 자동으로 이전 페이지로 이동
    if (items.length === 0 && page > 1) {
      const prevPage = page - 1;

      setPage(prevPage);
      updateUrl(trimmed, prevPage);

      const prevData = await fetchProducts(trimmed, prevPage);
      setProducts(prevData.items);
      setTotalProuctCount(prevData.totalCount);
      return;
    }

    // 기본 업데이트
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
      {/*  Search */}
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
    </div>
  );
}
