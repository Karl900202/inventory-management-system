"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"; // React Query imports
import Pagination from "@/components/Pagination";
import UpdateProductModal from "./_components/UpdateProductModal";
import TableRow from "./_components/TableRow";
import CommonConfirmModal from "@/components/CommonConfirmModal";
import { Product } from "./page";
import toast from "react-hot-toast";
import { useInventoryStore } from "@/store/InventoryStore";
import EmptyStateRow from "@/components/EmptyStateRow";
import { TableRowSkeleton } from "@/components/LoadingSkeleton";

const TABLE_HEADER = [
  "Name",
  "SKU",
  "Price",
  "Quantity",
  "Low Stock At",
  "Action",
];

import { fetchInventory, deleteProduct } from "@/lib/api";

export default function InventoryClient({
  initialProducts,
  initTotalProductCount,
  initPage,
  q,
}: {
  initialProducts: Product[];
  initTotalProductCount: number;
  initPage: number;
  q: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Zustand store
  const setProducts = useInventoryStore((state) => state.setProducts);
  const setTotalProductCount = useInventoryStore(
    (state) => state.setTotalProductCount
  );
  const setQuery = useInventoryStore((state) => state.setQuery);
  const setPage = useInventoryStore((state) => state.setPage);
  const products = useInventoryStore((state) => state.products);
  const totalProductCount = useInventoryStore(
    (state) => state.totalProductCount
  );
  const query = useInventoryStore((state) => state.query);
  const page = useInventoryStore((state) => state.page);

  // 로컬 상태
  const [inputValue, setInputValue] = useState(q);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 초기값 세팅 (Store) - 한 번만 실행
  useEffect(() => {
    setQuery(q);
    setPage(initPage);
    // products와 totalCount는 아래 useQuery의 useEffect에서 동기화됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- React Query: 데이터 조회 ---
  const { data, isError, isFetching } = useQuery({
    queryKey: ["inventory", query, page],
    queryFn: () => fetchInventory(query, page),
    placeholderData: keepPreviousData, // 페이지네이션 시 깜빡임 방지
    initialData: {
      items: initialProducts,
      totalCount: initTotalProductCount,
    },
  });

  // React Query 데이터를 Zustand Store와 동기화 (기존 로직 유지 목적)
  useEffect(() => {
    if (data) {
      setProducts(data.items);
      setTotalProductCount(data.totalCount);
    }
  }, [data, setProducts, setTotalProductCount]);

  // 에러 처리
  useEffect(() => {
    if (isError) {
      toast.error("fail fetch product");
    }
  }, [isError]);

  // URL 업데이트 헬퍼
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

  // --- React Query: 삭제 Mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      // 데이터 갱신
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });

      // 페이지 계산 및 리다이렉트 로직 (기존 로직 이식)
      const currentItemsCount = products.length; // 현재 화면에 보이는 개수 (삭제 전)
      if (currentItemsCount === 1 && page > 1) {
        // 마지막 아이템을 삭제했다면 이전 페이지로 이동
        const prevPage = page - 1;
        updateUrl(query, prevPage);
        setPage(prevPage);
      }
      setDeleteTargetId(null);
      toast.success("Product deleted");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleOpenEdit = useCallback(
    (id: string) => {
      const p = products.find((x) => x.id === id);
      if (p) setEditingProduct(p);
    },
    [products]
  );

  // 수정 성공 시 핸들러
  const handleUpdateSuccess = useCallback(async () => {
    setEditingProduct(null);
    // 쿼리 무효화 -> 자동 재요청 -> useEffect로 Store 업데이트
    await queryClient.invalidateQueries({ queryKey: ["inventory"] });
  }, [queryClient]);

  // 검색 핸들러
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newQueryValue = inputValue || "";
      const trimmed = newQueryValue.trim();
      const newPage = 1;

      // URL 변경
      updateUrl(trimmed, newPage);

      // Store 상태 변경 -> useQuery의 키가 바뀌면서 자동 Fetch 트리거
      setQuery(newQueryValue);
      setPage(newPage);
    },
    [inputValue, updateUrl, setQuery, setPage]
  );

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (e: { selected: number }) => {
      const newPage = e.selected + 1;
      const trimmed = query.trim();

      updateUrl(trimmed, newPage);

      // Store 상태 변경 -> useQuery의 키가 바뀌면서 자동 Fetch 트리거
      setPage(newPage);
    },
    [query, updateUrl, setPage]
  );

  const handleDeleteClick = useCallback(
    (id: string) => setDeleteTargetId(id),
    []
  );

  const handleCancelDelete = useCallback(() => setDeleteTargetId(null), []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
  }, [deleteTargetId, deleteMutation]);

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
            disabled={isFetching}
          />
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFetching}
          >
            {isFetching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
        {isFetching && data && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 rounded-full border-2 border-gray-300 border-t-purple-600"></div>
          </div>
        )}
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADER.map((name) => (
                <th
                  key={name}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isFetching && !data ? (
              <TableRowSkeleton colSpan={6} />
            ) : products.length === 0 ? (
              <EmptyStateRow colSpan={6} description="No data available" />
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length === 0 || (
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
              <div className="animate-spin h-6 w-6 rounded-full border-2 border-gray-300 border-t-purple-600"></div>
            </div>
          )}
          <Pagination
            page={page}
            totalProductCount={totalProductCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Update Modal */}
      {editingProduct && (
        <UpdateProductModal
          product={editingProduct}
          onClose={setEditingProduct}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTargetId && (
        <CommonConfirmModal
          title="Delete Product"
          description="Are you sure you want to delete this item?"
          cancelText="Cancel"
          confirmText={deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          disabled={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
