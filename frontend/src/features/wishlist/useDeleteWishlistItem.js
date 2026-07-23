import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFromWishlist } from "../../services/apiWishlist";
import toast from "react-hot-toast";

export const useDeleteWishlistItem = () => {
  const queryClient = useQueryClient();
  const {
    mutate: deleteWishlistItem,
    isPending: isDeletingWishlistItem,
    error: deleteWishlistItemError,
  } = useMutation({
    mutationKey: ["wishlist"],
    mutationFn: (productId) => deleteFromWishlist(productId),
    onSuccess: () => {
      toast.success("Item successfully deleted from wishlist.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return {
    deleteWishlistItem,
    isDeletingWishlistItem,
    deleteWishlistItemError,
  };
};
