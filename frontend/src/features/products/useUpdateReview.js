import { editReview } from "../../services/apiReviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateReview() {
  const queryClient = useQueryClient();

  const {
    mutate: updateReview,
    isPending: isUpdatingReview,
    error: updateReviewError,
  } = useMutation({
    mutationFn: ({ reviewId, rating, title, comment }) =>
      editReview(reviewId, rating, title, comment),
    onSuccess: () => {
      (toast.success("Review successfully updated"),
        queryClient.invalidateQueries({ queryKey: ["review"] }));
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    updateReview,
    isUpdatingReview,
    updateReviewError,
  };
}
