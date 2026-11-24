import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOneFromWishlist } from "../../services/apiWishlist";
import toast from "react-hot-toast";

export const useDeleteWishlistItem = (enabled = true) => {
  const queryClient = useQueryClient();
  const {
    mutate: deleteWishlistItem,
    isPending: isDeletingWishlistItem,
    error: deleteWishlistItemError,
  } = useMutation({
    mutationKey: ["wishlist"],
    mutationFn: (productId) => deleteOneFromWishlist(productId),
    onSuccess: () => {
      toast.success("Item successfully deleted from wishlist.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.message),
    enabled,
  });

  return {
    deleteWishlistItem,
    isDeletingWishlistItem,
    deleteWishlistItemError,
  };
};
