import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/apiProducts";
import { useSearchParams } from "react-router-dom";

export function useProducts() {
  const [searchParams] = useSearchParams();
  const { data, isPending, error } = useQuery({
    queryKey: ["product", searchParams.toString()],
    queryFn: () => getAllProducts(searchParams.toString()),
  });

  return { data, isPending, error };
}
