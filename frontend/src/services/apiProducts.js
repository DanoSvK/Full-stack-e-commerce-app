import { API_BASE_URL } from "../globalVariables";

export const getAllProducts = async (searchParams, queryParams) => {
  const params = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(queryParams)) {
    params.set(key, value);
  }
  console.log(queryParams);
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
