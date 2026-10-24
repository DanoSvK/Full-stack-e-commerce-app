import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllProducts } from "../../services/apiProducts";
import { useSearchParams } from "react-router-dom";

export function useProducts() {
  const [searchParams] = useSearchParams();
  const { data, isPending, isPlaceholderData, error } = useQuery({
    queryKey: ["product", searchParams.toString()],
    queryFn: () => getAllProducts(searchParams.toString()),
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isPlaceholderData, error };
}
