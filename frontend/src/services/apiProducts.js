import { API_BASE_URL } from "../globalVariables";

// Adding search params for UI filters and query params for backend filtering (sort, limit...)
export const getAllProducts = async (searchParams, queryParams) => {
  const params = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(queryParams)) {
    params.set(key, value);
  }

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

export const getProductsById = async (ids) => {
  const params = new URLSearchParams();

  ids.forEach((id) => params.append("ids", id));

  const res = await fetch(`${API_BASE_URL}/products/by-ids?${params}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data.data;
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
