import { API_BASE_URL } from "../globalVariables";

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

export const addItemToWishlist = async (productId) => {
  const res = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }
};

export const deleteFromWishlist = async (productId) => {
  const res = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }
};
