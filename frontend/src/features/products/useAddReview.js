import { addReview } from "../../services/apiReviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export function useAddReview() {
  const { prodId } = useParams();
  const queryClient = useQueryClient();

  const {
    mutate: submitReview,
    isPending: isSubmittingReview,
    error: submitReviewError,
  } = useMutation({
    mutationFn: ({ title, comment, rating }) =>
      addReview(title, comment, rating, prodId),
    onSuccess: () => {
      toast.success("Review successfully subimtted");
      queryClient.invalidateQueries({ queryKey: ["review", prodId] });
    },
    onError: (err) => toast.error(err.message),
  });

  return {
    submitReview,
    isSubmittingReview,
    submitReviewError,
  };
}
