import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncWishlist } from "../../services/apiWishlist";

export const useSyncWishlist = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (wishlist) => syncWishlist(wishlist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return { mutateAsync, isPending, error };
};
