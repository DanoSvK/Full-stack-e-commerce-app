import { useQuery } from "@tanstack/react-query";
import { getMinMaxPrice } from "../../services/apiPrices";

export function usePrices() {
  const { data, isPending, error } = useQuery({
    queryKey: ["price"],
    queryFn: getMinMaxPrice,
  });

  return { data, isPending, error };
}
