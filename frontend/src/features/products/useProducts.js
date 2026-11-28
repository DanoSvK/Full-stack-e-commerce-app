import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllProducts } from "../../services/apiProducts";
import { useSearchParams } from "react-router-dom";

export function useProducts(options = {}) {
  const queryParams = options;

  const [searchParams] = useSearchParams();
  const { data, isPending, isPlaceholderData, error } = useQuery({
    // Adding search params for UI filters and query params for backend filtering (sort, limit...)
    queryKey: ["product", searchParams.toString(), queryParams],
    queryFn: () => getAllProducts(searchParams.toString(), queryParams),
    retry: 1,
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isPlaceholderData, error };
}
