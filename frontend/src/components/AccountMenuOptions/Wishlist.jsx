import { Heart } from "lucide-react";
import WishlistProductList from "./WishlistProductList";
import { products } from "../../../products";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlistProducts } = useWishlist();

  const currentWishlist = products.filter((product) =>
    wishlistProducts.includes(product.id),
  );

  return (
    <>
      {!wishlistProducts.length ? (
        <>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-8">
            My Wishlist
          </h1>
          <div className="py-20 text-center space-y-4 bg-zinc-900/30 rounded-[40px] border border-dashed border-zinc-800">
            <Heart
              size={48}
              className="text-zinc-800 m-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-zinc-500">Your wishlist is empty.</p>
            <Link to="/products" className="btn-primary w-50 m-auto">
              Browse products
            </Link>
          </div>
        </>
      ) : (
        <section className="flex-1">
          <WishlistProductList products={currentWishlist} />
        </section>
      )}
    </>
  );
}

export default Wishlist;
