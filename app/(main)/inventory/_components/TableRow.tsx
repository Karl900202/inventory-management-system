"use client";

import React from "react";
import { Product } from "../InventoryClient";
import { formatNumber, formatUSD } from "@/lib/format";

type RowProps = {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function TableRow({ product, onEdit, onDelete }: RowProps) {
  console.log("TableRow");
  return (
    <tr className="hover:bg-gray-50 text-center">
      <td className="px-6 py-4 text-sm text-gray-500">{product.name}</td>

      <td className="px-6 py-4 text-sm text-gray-500">{product.sku || "-"}</td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {formatUSD(product.price)}$
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {formatNumber(product.quantity)}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {formatNumber(Number(product.lowStockAt))}
      </td>

      <td className="flex justify-center px-6 py-4">
        <button
          className="bg-white border border-gray-200 rounded-lg p-2 text-sm text-blue-600 hover:text-blue-900"
          onClick={() => onEdit(product.id)}
        >
          update
        </button>

        <button
          className="bg-white border border-gray-200 rounded-lg p-2 text-sm text-red-600 hover:text-red-900 ml-2"
          onClick={() => onDelete(product.id)}
        >
          delete
        </button>
      </td>
    </tr>
  );
}

export default React.memo(TableRow);
