"use client";

import { Product } from "../page";
import toast from "react-hot-toast";
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
  lowStockAt: number;
};

function UpdateProductModal({
  product,
  onClose,
  onUpdate,
}: {
  product: Product;
  onClose: (value: Product | null) => void;
  onUpdate: () => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: product.name,
      sku: product.sku ?? "-",
      price: product.price,
      quantity: product.quantity,
      lowStockAt: product.lowStockAt ? Number(product.lowStockAt) : 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/inventory/api", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: data.name,
          sku: data.sku === "-" ? null : data.sku || null,
          price: Number(data.price),
          quantity: Number(data.quantity),
          lowStockAt: Number(data.lowStockAt),
        }),
      });

      if (!res.ok) {
        toast.error("fail update");
        return;
      }

      await onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("fail update");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => onClose(null)}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Update Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name *</label>
            <input
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label className="text-sm text-gray-600">SKU</label>
            <input
              {...register("sku")}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm text-gray-600">Price *</label>
            <input
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              step="0.01"
              min={0}
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm text-gray-600">Quantity *</label>
            <input
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
              })}
              step="1"
              min={0}
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Low Stock At */}
          <div>
            <label className="text-sm text-gray-600">Low Stock At</label>
            <input
              {...register("lowStockAt", {
                valueAsNumber: true,
              })}
              type="number"
              min={0}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => onClose(null)}
            >
              Cancel
            </button>

            <button
              disabled={isSubmitting}
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(UpdateProductModal);
