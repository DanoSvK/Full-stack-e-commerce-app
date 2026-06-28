import { API_BASE_URL } from "../globalVariables";

export const addItemToWishlist = async (productId) => {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }
};

export const getWishlist = async () => {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data.data;
};
