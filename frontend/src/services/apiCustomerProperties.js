import { bre } from "../utils/bloomreach";
import { API_BASE_URL } from "../globalVariables";

const sdk = bre();

export const getCustomerProperties = async () => {
  const res = await fetch(`${API_BASE_URL}/users/getCustomerProperties`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  return data.data.customerProperties;
};

export const createUpdateCustomerProperties = async (action, key, value) => {
  const res = await fetch(
    `${API_BASE_URL}/users/createUpdateCustomerProperties`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, key, value }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }

  sdk?.update({ [key]: value });
  return res.json();
};

export const deleteCustomerProperty = async (key) => {
  const res = await fetch(`${API_BASE_URL}/users/deleteCustomerProperty`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with status ${res.status}`,
    );
  }
};
