"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  lowStockAt?: number;
};

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      quantity: undefined,
      price: undefined,
      sku: "",
      lowStockAt: undefined,
    },
  });

  async function onSubmit(data: FormValues) {
    const body = {
      ...data,
      sku: data.sku || undefined,
      lowStockAt: data.lowStockAt ?? undefined,
    };

    try {
      const res = await fetch("/add-product/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Failed: " + JSON.stringify(err));
        return;
      }

      toast.success("Product created!");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          placeholder="Enter Product Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Quantity + Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            min={0}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
            })}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
            })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SKU (optional)
        </label>
        <input
          type="text"
          placeholder="Enter SKU"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          {...register("sku")}
        />
      </div>

      {/* Low Stock At */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Low Stock At (optional)
        </label>
        <input
          type="number"
          min={0}
          placeholder="Enter low stock threshold"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          {...register("lowStockAt", { valueAsNumber: true })}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>

        <a
          onClick={() => reset()}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Reset
        </a>
      </div>
    </form>
  );
}
