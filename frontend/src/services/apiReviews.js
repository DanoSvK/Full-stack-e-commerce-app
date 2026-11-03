import { API_BASE_URL } from "../globalVariables";

export const getReviewsByProduct = async (prodId, searchParams) => {
  if (!prodId) return;

  const res = await fetch(
    `${API_BASE_URL}/products/${prodId}/reviews?${searchParams}`,
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data;
};

export const addReview = async (title, comment, rating, prodId) => {
  const res = await fetch(`${API_BASE_URL}/products/${prodId}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, comment, rating }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }
};

export const editReview = async (reviewId, rating, title, comment) => {
  console.log(reviewId, rating, title, comment);

  const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, title, comment }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }
};
