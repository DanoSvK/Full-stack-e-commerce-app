import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllProducts } from "../../services/apiProducts";
import { useSearchParams } from "react-router-dom";

export function useProducts(options = {}) {
  const queryParams = options;

  const [searchParams] = useSearchParams();
  const { data, isPending, isPlaceholderData, error } = useQuery({
    queryKey: ["product", searchParams.toString(), queryParams],
    queryFn: () => getAllProducts(searchParams.toString(), queryParams),
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isPlaceholderData, error };
}
