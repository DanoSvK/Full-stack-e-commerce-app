import { useQuery } from "@tanstack/react-query";
import { getSuggestedProducts } from "../../services/apiSuggestedProducts";

export const useSuggestedProducts = (param) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["suggestedProduct", param],
    queryFn: () => getSuggestedProducts(param),
    enabled: !!param && param.trim().length >= 2,
  });

  return { data, isPending, error };
};
