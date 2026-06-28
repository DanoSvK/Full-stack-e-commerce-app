import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItemToWishlist } from "../../services/apiWishlist";
import toast from "react-hot-toast";

export const useCreateWishlistItem = () => {
  const queryClient = useQueryClient();
  const {
    mutate: addToWishlist,
    isPending: isAddingToWishlist,
    error: addToWishlistError,
  } = useMutation({
    mutationFn: (productId) => addItemToWishlist(productId),
    onSuccess: () => {
      toast.success("Item successfully added to wishlist.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { addToWishlist, isAddingToWishlist, addToWishlistError };
};
