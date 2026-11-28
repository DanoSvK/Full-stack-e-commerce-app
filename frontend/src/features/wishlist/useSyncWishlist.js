import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncWishlist } from "../../services/apiWishlist";

export const useSyncWishlist = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (wishlist) => syncWishlist(wishlist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    retry: 1,
  });

  return { mutate, isPending, error };
};
