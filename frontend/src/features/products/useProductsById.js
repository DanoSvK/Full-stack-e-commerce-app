import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProductsById } from "../../services/apiProducts";

export function useProductsById(ids = []) {
  const { data, isFetching, isPlaceholderData, error } = useQuery({
    queryKey: ["product", "by-ids", ids],
    queryFn: () => getProductsById(ids),
    placeholderData: keepPreviousData,
    retry: 1,
    enabled: ids.length > 0,
  });

  return { data, isFetching, isPlaceholderData, error };
}
