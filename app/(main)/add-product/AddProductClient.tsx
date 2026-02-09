"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, type ProductFormData } from "@/lib/api";

type FormValues = {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  lowStockAt?: number;
};

export default function AddProductForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      quantity: undefined,
      price: undefined,
      sku: "",
      lowStockAt: undefined,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: () => {
      toast.success("Product created!");
      reset();
      // 인벤토리 쿼리 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed: " + error.message);
    },
  });

  async function onSubmit(data: FormValues) {
    createProductMutation.mutate(data);
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
          disabled={createProductMutation.isPending}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {createProductMutation.isPending ? "Adding..." : "Add Product"}
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
