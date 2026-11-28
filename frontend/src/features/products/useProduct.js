import { useQuery } from "@tanstack/react-query";
import { getOneProduct } from "../../services/apiProducts";
import { useParams } from "react-router-dom";

export function useProduct() {
  const { prodId } = useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["product", prodId],
    queryFn: () => getOneProduct(prodId),
    retry: 1,
  });

  return { data, isPending, error };
}
