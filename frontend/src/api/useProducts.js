import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/apiProducts";
import { useSearchParams } from "react-router-dom";

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: products,
    isPending: isFetching,
    error,
  } = useQuery({
    queryKey: ["product", searchParams.toString()],
    queryFn: () => getAllProducts(searchParams.toString()),
  });

  return { products, isFetching, error };
}
