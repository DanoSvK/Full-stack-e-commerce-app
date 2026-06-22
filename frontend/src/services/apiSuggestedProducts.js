import { API_BASE_URL } from "../globalVariables";

export const getSuggestedProducts = async (param) => {
  if (!param) return;

  const res = await fetch(
    `${API_BASE_URL}/products/suggestions?suggestions=${param}`,
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
