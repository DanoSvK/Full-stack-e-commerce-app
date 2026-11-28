import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../services/apiWishlist";

export const useWishlist = (enabled = true) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist().then((res) => res.wishlist),
    retry: 1,
    enabled,
  });

  return { data, isPending, error };
};
