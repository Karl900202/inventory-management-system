"use client";

import CommonButton from "../common-button";
import { deleteProduct } from "@/lib/actions/products";

export default function DeleteButtonWrapper({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children?: React.ReactNode;
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
      {children}
    </CommonButton>
  );
}
