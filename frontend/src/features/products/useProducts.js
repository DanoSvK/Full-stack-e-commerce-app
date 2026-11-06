import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllProducts } from "../../services/apiProducts";
import { useSearchParams } from "react-router-dom";

export function useProducts(options = {}) {
  const take = options;
  const [searchParams] = useSearchParams();
  const { data, isPending, isPlaceholderData, error } = useQuery({
    queryKey: ["product", searchParams.toString(), take],
    queryFn: () => getAllProducts(searchParams.toString(), take),
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isPlaceholderData, error };
}
