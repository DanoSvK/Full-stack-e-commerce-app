import { useQuery } from "@tanstack/react-query";
import { getOneProduct } from "../../services/apiProducts";
import { useParams } from "react-router-dom";

export function useProduct() {
  const { prodId } = useParams();

  const {
    data: product,
    isPending: isFetching,
    error,
  } = useQuery({
    queryKey: ["product"],
    queryFn: () => getOneProduct(prodId),
  });

  return { product, isFetching, error };
}
