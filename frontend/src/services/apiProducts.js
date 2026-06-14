import { API_BASE_URL } from "../globalVariables";

export const getAllProducts = async (searchParams) => {
  console.log(searchParams);
  const res = await fetch(
    `${API_BASE_URL}/products?${searchParams.toString()}`,
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data.data.records;
};
