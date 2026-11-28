import { useQuery } from "@tanstack/react-query";
import { getProductCategories } from "../../services/apiCategories";

export function useCategories() {
  const { data, isPending, error } = useQuery({
    queryKey: ["category"],
    queryFn: getProductCategories,
    retry: 1,
  });

  return { data, isPending, error };
}
