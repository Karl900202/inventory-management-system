"use client";

import CommonButton from "@/component/common-button";
import { deleteProduct } from "@/lib/actions/products";

export default function DeleteButtonWrapper({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  async function handleDelete() {
    const ok = confirm("Are you sure you want to delete this?");
    if (!ok) return;

    const formData = new FormData();
    formData.append("id", id);
    await deleteProduct(formData);
  }

  return (
    <CommonButton onClick={handleDelete} className={className}>
      delete
    </CommonButton>
  );
}
