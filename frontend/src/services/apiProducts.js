import { API_BASE_URL } from "../globalVariables";

export const getAllProducts = async (searchParams, limit) => {
  const params = new URLSearchParams(searchParams);

  if (limit.take !== undefined) {
    params.set("take", limit.take);
  }

  console.log(`${API_BASE_URL}/products?${params}`);
  const res = await fetch(`${API_BASE_URL}/products?${params}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data;
};

export const getOneProduct = async (prodId) => {
  const res = await fetch(`${API_BASE_URL}/products/${prodId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data.data;
};
