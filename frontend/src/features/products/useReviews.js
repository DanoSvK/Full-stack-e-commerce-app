import { useQuery } from "@tanstack/react-query";
import { getReviewsByProduct } from "../../services/apiReviews";
import { useParams, useSearchParams } from "react-router-dom";

export function useReviews() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isPending, error, refetch, isFetching } = useQuery({
    queryKey: ["review", params.prodId, searchParams.toString()],
    queryFn: () => getReviewsByProduct(params.prodId, searchParams.toString()),
  });

  return { data, isPending, error, refetch, isFetching };
}
