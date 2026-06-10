import { bre } from "../utils/bloomreach";

const sdk = bre();

const API = "http://localhost:3000/api/v1"; // your base URL

export const getCustomerProperties = async () => {
  try {
    const res = await fetch(`${API}/users/getCustomerProperties`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data.data.customerProperties;
  } catch (err) {
    console.log(err);
  }
};

export const createUpdateCustomerProperties = async (action, key, value) => {
  try {
    const res = await fetch(`${API}/users/createUpdateCustomerProperties`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, key, value }),
    });

    if (!res.ok) throw new Error("Problem");

    sdk?.update({ [key]: value });
  } catch (err) {
    console.log(err);
  }
};
