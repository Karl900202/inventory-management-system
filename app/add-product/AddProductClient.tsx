"use client";

import { useState } from "react";

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);

  // 폼 상태 관리
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    sku: "",
    lowStockAt: "",
  });

  // 하나의 onChange로 전체 input 처리
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddProduct() {
    setLoading(true);

    const body = {
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
      sku: form.sku || undefined,
      lowStockAt: form.lowStockAt ? Number(form.lowStockAt) : undefined,
    };

    try {
      const res = await fetch("/add-product/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed: " + JSON.stringify(err));
        return;
      }

      alert("Product created!");

      // reset
      setForm({
        name: "",
        quantity: "",
        price: "",
        sku: "",
        lowStockAt: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Product Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            min={0}
            placeholder="0"
            required
            value={form.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min={0}
            placeholder="0.00"
            required
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SKU (optional)
        </label>
        <input
          type="text"
          name="sku"
          placeholder="Enter SKU"
          value={form.sku}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Low Stock At (optional)
        </label>
        <input
          type="number"
          name="lowStockAt"
          min={0}
          placeholder="Enter low stock threshold"
          value={form.lowStockAt}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex justify-center gap-5">
        <button
          type="button"
          disabled={loading}
          onClick={handleAddProduct}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

        <a
          href="/inventory"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </a>
      </div>
    </div>
  );
}
