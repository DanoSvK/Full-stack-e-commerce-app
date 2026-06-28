import { getCustomerProperties } from "../../services/apiCustomerProperties";
import { useQuery } from "@tanstack/react-query";

export function useCustomerProperties() {
  const { data, isPending, error } = useQuery({
    queryKey: ["customerProperty"],
    queryFn: getCustomerProperties,
  });

  return { data, isPending, error };
}
