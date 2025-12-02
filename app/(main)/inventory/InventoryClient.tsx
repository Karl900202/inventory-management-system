"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import UpdateProductModal from "./_components/UpdateProductModal";
import TableRow from "./_components/TableRow";
import CommonConfirmModal from "@/components/CommonConfirmModal";
import { Product } from "./page";
import toast from "react-hot-toast";
import { useInventoryStore } from "@/store/InventoryStore";
import EmptyStateRow from "@/components/EmptyStateRow";

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

  // Zustand store 초기값 세팅
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

  // 로컬
  const [inputValue, setInputValue] = useState(q);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 초기값 세팅
  useState(() => {
    setProducts(initialProducts);
    setTotalProductCount(initTotalProductCount);
    setQuery(q);
    setPage(initPage);
  });

  const handleOpenEdit = useCallback(
    (id: string) => {
      const p = products.find((x) => x.id === id);
      if (p) setEditingProduct(p);
    },
    [products]
  );

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

  const handleUpdateSuccess = useCallback(async () => {
    setEditingProduct(null);
    const trimmed = query.trim();
    const { items, totalCount } = await fetchProducts(trimmed, page);

    setProducts(items);
    setTotalProductCount(totalCount);
  }, [fetchProducts, page, query, setProducts, setTotalProductCount]);

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

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newQueryValue = inputValue || "";
      const trimmed = newQueryValue.trim();
      const newPage = 1;

      updateUrl(trimmed, newPage);
      const { items, totalCount } = await fetchProducts(trimmed, newPage);

      setQuery(newQueryValue);
      setPage(newPage);
      setProducts(items);
      setTotalProductCount(totalCount);
    },
    [
      fetchProducts,
      inputValue,
      updateUrl,
      setProducts,
      setTotalProductCount,
      setQuery,
      setPage,
    ]
  );

  const handlePageChange = useCallback(
    async (e: { selected: number }) => {
      const newPage = e.selected + 1;
      const trimmed = query.trim();

      const { items, totalCount } = await fetchProducts(trimmed, newPage);
      updateUrl(trimmed, newPage);

      setPage(newPage);
      setProducts(items);
      setTotalProductCount(totalCount);
    },
    [
      fetchProducts,
      query,
      updateUrl,
      setProducts,
      setTotalProductCount,
      setPage,
    ]
  );

  const handleDeleteClick = useCallback(
    (id: string) => setDeleteTargetId(id),
    []
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await fetch(`/inventory/api?id=${id}`, { method: "DELETE" });
      if (!res.ok) return;

      const trimmed = query.trim();
      const { items, totalCount } = await fetchProducts(trimmed, page);
      const totalPages = Math.max(1, Math.ceil(totalCount / 10));

      if (items.length === 0 && page > 1 && page > totalPages) {
        const prevPage = page - 1;
        updateUrl(trimmed, prevPage);
        const prevData = await fetchProducts(trimmed, prevPage);
        setProducts(prevData.items);
        setTotalProductCount(prevData.totalCount);
        setPage(prevPage);
        return;
      }

      setProducts(items);
      setTotalProductCount(totalCount);
    },
    [
      fetchProducts,
      page,
      query,
      updateUrl,
      setProducts,
      setTotalProductCount,
      setPage,
    ]
  );

  const handleCancelDelete = useCallback(() => setDeleteTargetId(null), []);

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
            {products.length === 0 ? (
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
        <Pagination
          page={page}
          totalProductCount={totalProductCount}
          onPageChange={handlePageChange}
        />
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
          confirmText="Yes, Delete"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
