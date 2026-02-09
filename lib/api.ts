// API 호출 함수들

export type ProductFormData = {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  lowStockAt?: number;
};

export type UpdateProductData = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
  lowStockAt: number;
};

// 제품 추가
export const createProduct = async (data: ProductFormData) => {
  const body = {
    ...data,
    sku: data.sku || undefined,
    lowStockAt: data.lowStockAt ?? undefined,
  };

  const res = await fetch("/add-product/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }

  return res.json();
};

// 제품 업데이트
export const updateProduct = async (data: UpdateProductData) => {
  const res = await fetch("/inventory/api", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }

  return res.json();
};

// 제품 삭제
export const deleteProduct = async (id: string) => {
  const res = await fetch(`/inventory/api?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};

// 인벤토리 조회
export const fetchInventory = async (q: string, page: number) => {
  const trimmed = q.trim();
  const apiUrl = trimmed
    ? `/inventory/api?q=${encodeURIComponent(trimmed)}&page=${page}`
    : `/inventory/api?page=${page}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
