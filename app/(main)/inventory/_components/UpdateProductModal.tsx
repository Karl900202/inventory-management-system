"use client";

import { useState } from "react";
import { Product } from "../InventoryClient";
import React from "react";

function UpdateProductModal({
  product,
  onClose,
  onUpdate,
}: {
  product: Product;
  onClose: (value: Product | null) => void;
  onUpdate: () => Promise<void>;
}) {
  // --- 입력 상태 정의 ---
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku ?? "-");
  const [price, setPrice] = useState(String(product.price));
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [lowStockAt, setLowStockAt] = useState(
    product.lowStockAt ? Number(product.lowStockAt) : 0
  );

  const [loading, setLoading] = useState(false);

  // --- Save 버튼 핸들러 ---
  async function handleSave() {
    if (price === "") return alert("Price is required");
    if (quantity === "") return alert("Quantity is required");
    if (name.trim() === "") return alert("Name is required");

    setLoading(true);

    try {
      const res = await fetch("/inventory/api", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name,
          sku: sku === "-" ? null : sku || null, // 빈 값이면 DB NULL
          price: Number(price),
          quantity: Number(quantity),
          lowStockAt: lowStockAt ? Number(lowStockAt) : 0,
        }),
      });

      if (!res.ok) {
        alert("fail update");
        return;
      }

      await onUpdate(); // 부모 리스트 새로고침 + 모달 닫기 Callback
    } catch (err) {
      console.error(err);
      alert("fail update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => {
        onClose(null);
      }}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Update Product</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">SKU</label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Price *</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min={0}
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Quantity *</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              step="1"
              min={0}
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Low Stock At</label>
            <input
              value={lowStockAt}
              onChange={(e) => setLowStockAt(Number(e.target.value))}
              type="number"
              min={0}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              onClose(null);
            }}
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={handleSave}
          >
            {loading ? "saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UpdateProductModal);
