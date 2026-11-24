import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllWishlist } from "../../services/apiWishlist";
import toast from "react-hot-toast";

export const useDeleteAllWishlist = (enabled = true) => {
  const queryClient = useQueryClient();
  const {
    mutate: deleteWishlist,
    isPending: isDeletingWishlist,
    error: deleteWishlistError,
  } = useMutation({
    mutationKey: ["wishlist"],
    mutationFn: () => deleteAllWishlist(),
    onSuccess: () => {
      toast.success("Wishlist successfully deleted.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.message),
    enabled,
  });

  return {
    deleteWishlist,
    isDeletingWishlist,
    deleteWishlistError,
  };
};
