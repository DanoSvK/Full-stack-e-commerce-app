import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../services/apiWishlist";

export const useWishlist = () => {
  const {
    data: wishlist,
    isPending: isFetchingWishlist,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await getWishlist();
      return res.wishlist;
    },
  });

  return { wishlist, isFetchingWishlist, error };
};
