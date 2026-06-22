import { getCustomerProperties } from "../services/apiCustomerProperties";
import { useQuery } from "@tanstack/react-query";

export function useCustomerProperties() {
  const {
    data: customerProperties,
    isPending,
    error,
  } = useQuery({
    queryKey: ["customerProperty"],
    queryFn: getCustomerProperties,
  });

  return { customerProperties, isPending, error };
}
