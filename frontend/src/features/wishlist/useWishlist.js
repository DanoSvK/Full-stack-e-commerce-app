import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../services/apiWishlist";

export const useWishlist = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await getWishlist();
      return res.wishlist;
    },
  });

  return { data, isPending, error };
};
