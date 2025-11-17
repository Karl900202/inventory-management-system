"use client";
import { deleteProduct } from "@/lib/actions/products";
export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    const ok = confirm("삭제하시겠습니까?");
    if (!ok) return;
    const formData = new FormData();
    formData.append("id", id);
    await deleteProduct(formData);
  }
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900"
    >
      {" "}
      delete{" "}
    </button>
  );
}
