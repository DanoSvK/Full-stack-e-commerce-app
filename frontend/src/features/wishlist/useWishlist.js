import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../services/apiWishlist";

export const useWishlist = (enabled = true) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await getWishlist();
      return res.wishlist;
    },
    enabled,
  });

  console.log({
    data,
    isPending,
    error,
  });

  return { data, isPending, error };
};
