import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist } from "../services/apiWishlist";
import toast from "react-hot-toast";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const {
    mutate: addItemToWishlist,
    isPending: isAddingToWishlist,
    error,
  } = useMutation({
    mutationFn: (productId) => addToWishlist(productId),
    onSuccess: () => {
      toast.success("Item successfully added to wishlist.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { addItemToWishlist, isAddingToWishlist, error };
};
