"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import UpdateProductModal from "./_components/UpdateProductModal";
import TableRow from "./_components/TableRow";
import ConfirmModal from "@/component/common-confirm-modal";
import { Product } from "./page";
import toast from "react-hot-toast";

const TABLE_HEADER = [
  "Name",
  "SKU",
  "Price",
  "Quantity",
  "Low Stock At",
  "Action",
];

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
  const [inputValue, setInputValue] = useState(q);
  const [totalPageCount, setTotalProuctCount] = useState(totalProductCount);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  /** 삭제 모달 대상 */
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenEdit = useCallback(
    (id: string) => {
      const p = products.find((x) => x.id === id);
      if (p) setEditingProduct(p);
    },
    [products]
  );

  // /** ESC 모달 닫기 */
  // useEffect(() => {
  //   function onKeyDown(e: KeyboardEvent) {
  //     if (e.key === "Escape") setEditingProduct(null);
  //   }
  //   window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, []);

  const fetchProducts = useCallback(async (q: string, page: number) => {
    try {
      const trimmed = q.trim();

      const apiUrl = trimmed
        ? `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${page}`
        : `/inventory/api?page=${page}`;

      const res = await fetch(apiUrl);

      return res.json();
    } catch (error) {
      console.log(error);
      toast.error("fail fetch product");
    }
  }, []);

  /** UPDATE 성공 */
  const handleUpdateSuccess = useCallback(async () => {
    setEditingProduct(null);

    const trimmed = query.trim();
    const { items, totalCount } = await fetchProducts(trimmed, page);

    setProducts(items);
    setTotalProuctCount(totalCount);
  }, [fetchProducts, query, page]);

  const updateUrl = useCallback(
    (q: string, page: number) => {
      const trimmed = q.trim();

      const url = trimmed
        ? `/inventory?query=${encodeURIComponent(trimmed)}&page=${page}`
        : `/inventory?page=${page}`;

      router.replace(url);
    },
    [router]
  );

  /** 검색 */
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const newQueryValue = inputValue || "";
    const trimmed = newQueryValue.trim();
    const newPage = 1;

    updateUrl(trimmed, newPage);
    const { items, totalCount } = await fetchProducts(trimmed, newPage);

    setQuery(newQueryValue);
    setPage(newPage);
    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  /** 페이징 */
  async function handlePageChange(e: { selected: number }) {
    const newPage = e.selected + 1;
    const trimmed = query.trim();

    const { items, totalCount } = await fetchProducts(trimmed, newPage);

    updateUrl(trimmed, newPage);
    setPage(newPage);
    setProducts(items);
    setTotalProuctCount(totalCount);
  }

  /** 삭제 버튼 클릭 → 모달만 열기 */
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteTargetId(id);
  }, []);

  /** 실제 삭제 실행 */
  const handleDelete = useCallback(
    async (id: string) => {
      const res = await fetch(`/inventory/api?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Delete failed");
        return;
      }

      const trimmed = query.trim();
      const { items, totalCount } = await fetchProducts(trimmed, page);
      const totalPages = Math.max(1, Math.ceil(totalCount / 10));

      // 현재 페이지가 비어 있으면 → 이전 페이지로
      if (items.length === 0 && page > 1 && page > totalPages) {
        const prevPage = page - 1;

        updateUrl(trimmed, prevPage);

        const prevData = await fetchProducts(trimmed, prevPage);
        setProducts(prevData.items);
        setTotalProuctCount(prevData.totalCount);
        setPage(prevPage);
        return;
      }

      // 정상 갱신
      setProducts(items);
      setTotalProuctCount(totalCount);
    },
    [fetchProducts, page, query, updateUrl]
  );

  const handleCancelDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    await handleDelete(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId, handleDelete]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
              {TABLE_HEADER.map((name, idx) => (
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
              <TableRow
                key={product.id}
                product={product}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteClick}
              />
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

      {/* UPDATE 모달 */}
      {editingProduct && (
        <UpdateProductModal
          product={editingProduct}
          onClose={setEditingProduct}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {/* DELETE Confirm Common Modal */}
      {deleteTargetId && (
        <ConfirmModal
          title="Delete Product"
          description="Are you sure you want to delete this item?"
          cancelText="Cancel"
          confirmText="Yes, Delete"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
