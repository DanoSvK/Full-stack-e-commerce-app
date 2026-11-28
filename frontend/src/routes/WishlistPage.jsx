import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../features/wishlist/useWishlist";
// import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";
import LoaderError from "../ui/LoaderError";
import { getEffectivePrice } from "../utils/getEffectivePrice";
import { useProducts } from "../features/products/useProducts";
import CartPageSkeleton from "../components/skeletons/CartPageSkeleton";
import { useAuth } from "../context/AuthContext";
import WishlistCardList from "../components/WishlistCardList";
import { WishlistContext } from "../context/WishlistContext";
import { useContext } from "react";
import { useDeleteAllWishlist } from "../features/wishlist/useDeleteAllWishlist";

function WishlistPage() {
  const { user, isAuthLoading } = useAuth();

  const {
    data: wishlist,
    isPending: isFetchingWishlist,
    error: wishlistError,
  } = useWishlist(!!user && !isAuthLoading);

  const { deleteWishlist, isDeletingWishlist, deleteWishlistError } =
    useDeleteAllWishlist();

  const { wishlistCtx, removeWishlistCtx } = useContext(WishlistContext);

  const guestWishlist = wishlistCtx;

  const {
    data: productsData,
    isPending: isFetchingProducts,
    error: productsError,
  } = useProducts({ shouldPaginate: false });

  // Guard before doing anything with products
  if (isFetchingProducts || (isFetchingWishlist && user)) {
    return <CartPageSkeleton />;
  }

  if (productsError) return <LoaderError />;

  const productMap = Object.fromEntries(
    productsData.products.map((p) => [p.id, p]),
  );

  if (wishlistError && user) {
    return <LoaderError />;
  }

  //   if (isFetchingWishlist) {
  //     return <ProductListSkeleton length={3} />;
  //   }

  const wishlistProducts = user
    ? wishlist?.map((item) => ({
        ...productMap[item.productId],
      }))
    : guestWishlist?.map((item) => ({
        ...productMap[item],
      }));

  const totalPrice = wishlistProducts?.reduce(
    (total, product) => total + getEffectivePrice(product) * 1,
    0,
  );

  const productsInStock = wishlistProducts.filter((p) => p.stock > 0).length;

  const VAT = 0.23;
  const taxPrice = totalPrice * VAT;
  const totalBeforeTax = totalPrice - taxPrice;

  function handleRemoveWishlist() {
    if (user) {
      deleteWishlist();
    } else {
      removeWishlistCtx();
    }
  }

  return (
    <>
      {!wishlistProducts.length ? (
        <>
          <h1 className="text-3xl font-black tracking-tighter text-header uppercase mb-8">
            My Wishlist
          </h1>
          <div className="flex flex-col items-center gap-3 py-20 text-center bg-zinc-900/30 rounded-[40px] border border-dashed border-zinc-800">
            <div className="w-24 h-24 bg-zinc-900 text-zinc-700 rounded-full flex items-center justify-center">
              <Heart size={48} aria-hidden="true" />
            </div>
            <h2 className="text-header text-2xl tracking-tight font-bold mb-0">
              Your wishlist is empty.
            </h2>
            <p className="max-w-md text-center mx-auto text-main">
              Save products you love and come back to them anytime. Tap the
              heart on any product to start building your list.
            </p>
            <Link to="/products" className="btn-primary w-50 m-auto">
              Browse products
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex item-center justify-between">
            <h1 className="text-3xl font-black tracking-tighter text-header uppercase mb-8">
              My Wishlist
            </h1>
            <div className="inline-flex items-center gap-2">
              <Link
                to="/products"
                className="hover:text-header text-sm transition-colors font.bold text-main"
              >
                Keep browsing
              </Link>
              <button
                className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-2 text-sm font-bold text-main transition-colors hover:border-red-500/40 hover:text-red-400 cursor-pointer"
                onClick={() => {
                  handleRemoveWishlist();
                }}
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="sm:col-span-2 space-y-6">
              {/* WISHLIST ITEM */}
              <WishlistCardList
                wishlistProducts={wishlistProducts}
                user={user}
              />
            </div>
            <section className="space-y-8 sticky">
              <section className="space-y-6 p-8 glass-card rounded-3xl">
                <h3 className="text-header font-bold text-xl uppercase tracking-tight">
                  Wishlist summary
                </h3>
                <div className="text-sm space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-main">Saved items</p>
                    <p className="text-header font-bold">
                      {wishlistProducts.length}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-main">In stock</p>
                    <p className="text-header font-bold">{productsInStock}</p>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                    <p className="text-header font-bold  ">Estimated value</p>
                    <p className="font-black text-accent">
                      {totalPrice.toFixed(2)} €
                    </p>
                  </div>
                  <p>
                    Move items to your cart when you are ready. Removing an item
                    only clears it from this list.
                  </p>
                </div>
                <div>
                  <Link
                    to="/cart"
                    className="btn-primary w-full flex items-center justify-center gap-2 group"
                  >
                    Go to cart
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </section>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default WishlistPage;
