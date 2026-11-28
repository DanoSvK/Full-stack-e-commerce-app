import { Heart, ShoppingCart, Star, CheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCreateWishlistItem } from "../wishlist/useCreateWishlistItem";
import { useWishlist } from "../wishlist/useWishlist";
import { useDeleteWishlistItem } from "../wishlist/useDeleteWishlistItem";
import { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { WishlistContext } from "../../context/WishlistContext";

function ProductCard({ product, layout = "grid" }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { onAddCartProducts } = useCart();
  const { user, isAuthLoading } = useAuth();
  const [imgError, setImgError] = useState(false);

  const {
    data: wishlist,
    isPending: isPendingWishlist,
    error: wishlistError,
  } = useWishlist(!!user && !isAuthLoading);

  const { addToWishlist, isAddingToWishlist, addToWishlistError } =
    useCreateWishlistItem();
  const { wishlistCtx, addToWishlistCtx, removeFromWishlistCtx } =
    useContext(WishlistContext);

  const {
    deleteWishlistItem,
    isDeletingWishlistItem,
    deleteWishlistItemError,
  } = useDeleteWishlistItem();

  const wishlistUnavailable = !!user && !!wishlistError && !wishlist;
  const active = wishlist?.some((prod) => prod.productId === product?.id);
  const activeCtx = wishlistCtx?.some((prodId) => prodId === product?.id);

  // Out-of-stock dimming is applied per block (never on a parent of the
  // wishlist button), because a parent's opacity can't be undone by a child.
  const isOutOfStock = product.stock === 0;
  const dim = isOutOfStock ? "opacity-50 pointer-events-none" : "";

  function handleAddDeleteWishlistItem(productId) {
    if (!user) {
      if (!activeCtx) {
        addToWishlistCtx(productId);
      } else {
        removeFromWishlistCtx(productId);
      }

      return;
    }

    if (!active) {
      addToWishlist(productId);
    } else {
      deleteWishlistItem(productId);
    }
  }

  function handleAddToCart() {
    onAddCartProducts(product.id, 1);
    setIsAddedToCart(true);
  }

  if (layout === "list") {
    return (
      <div
        className={`relative flex glass-card rounded-2xl overflow-hidden p-5 group ${
          isOutOfStock ? "no-hover cursor-not-allowed" : ""
        }`}
      >
        {/* image */}
        <div className={`overflow-hidden cursor-pointer ${dim}`}>
          <Link
            to={`/product/${product.id}`}
            className="w-full sm:w-48 aspect-4/3 rounded-xl overflow-hidden bg-zinc-900 shrink-0 block"
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* info */}
        <div className={`space-y-6 p-5 flex-1 ${dim}`}>
          <div className="flex items-center justify-between gap-2 text-xs text-main mb-1.5">
            <div className="space-x-2">
              <span className="bg-zinc-900/80 backdrop-blur-md text-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {product.subcategory.categories[0].category.name}
              </span>
              <span className="bg-zinc-900/80 backdrop-blur-md text-main font-bold px-2 py-1 rounded uppercase tracking-wider">
                {product.subcategory.name}
              </span>
            </div>

            {product.ratingsAverage ? (
              <span className="flex items-center gap-1 font-bold tabular-nums">
                <Star size={12} fill="#ffde21" color="#ffde21" />
                <span className="text-accent">
                  {product.ratingsAverage.toFixed(1)}
                </span>
                <span>({product.ratingsQuantity})</span>
              </span>
            ) : (
              <span className="text-[11px] text-main/60">No reviews</span>
            )}
          </div>
          <div>
            <Link
              to={`/product/${product.id}`}
              className="text-header font-bold text-lg hover:text-accent transition-colors line-clamp-1"
            >
              {product.title}
            </Link>
            <p className="text-main text-xs mt-1" key={product.description}>
              {product.description}
            </p>
          </div>
          <p className="flex gap-4 text-xs">
            <span>{product.variants.colors.length} Colors</span>
            <span>·</span>
            <span
              className={`${product.stock > 0 ? "text-green-400" : "text-red-500"}`}
            >
              {product.stock > 0 ? "In Stock" : "Out of stock"}
            </span>
          </p>
        </div>

        {/* right column: NOT dimmed itself, so the heart stays at full opacity */}
        <div className="flex flex-col items-center justify-around">
          <div className={`text-right self-end ${dim}`}>
            <p className="text-main text-[10px] uppercase font-bold tracking-widest">
              Price
            </p>
            {product.discountPrice ? (
              <div className="flex flex-col gap-2">
                <p className="text-header font-black text-2xl tabular-nums">
                  {product.discountPrice.toFixed(2)} €
                </p>
                <span className="text-main text-xs line-through tabular-nums">
                  {" "}
                  {product.price.toFixed(2)} €
                </span>
              </div>
            ) : (
              <div className="gap-2">
                <p className="text-header font-black text-2xl tabular-nums">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {/* heart button: no dimming */}
            <button
              type="button"
              aria-label={
                wishlistUnavailable
                  ? "Wishlist temporarily unavailable"
                  : active || activeCtx
                    ? "Remove from wishlist"
                    : "Add to wishlist"
              }
              title={
                wishlistUnavailable
                  ? "Wishlist temporarily unavailable. Please try again later."
                  : ""
              }
              disabled={
                isAuthLoading ||
                (!!user && isPendingWishlist) ||
                wishlistUnavailable ||
                isAddingToWishlist ||
                isDeletingWishlistItem
              }
              className={`flex items-center justify-center p-3 rounded-xl border border-white/10 hover:border-accent/40 backdrop-blur-md transition-all duration-300 text-header pointer-events-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                active || activeCtx
                  ? "bg-accent"
                  : "bg-zinc-900/40 enabled:hover:bg-zinc-900/80"
              } ${
                addToWishlistError ||
                deleteWishlistItemError ||
                wishlistUnavailable
                  ? "border border-red-500"
                  : ""
              }`}
              onClick={() => handleAddDeleteWishlistItem(product.id)}
            >
              <Heart
                size={18}
                color={active || activeCtx ? "#000" : "#fff"}
                fill={active || activeCtx ? "#000" : "none"}
              />
            </button>

            {/* cart / added / out of stock: dimmed */}
            <div className={dim}>
              {isAddedToCart ? (
                <button
                  disabled
                  className="btn-primary flex items-center gap-2"
                >
                  <CheckIcon size={20} />
                  <span>Added</span>
                </button>
              ) : isOutOfStock ? (
                <button
                  disabled
                  className="btn-primary flex items-center gap-2"
                >
                  <span>Out of stock</span>
                </button>
              ) : (
                <button
                  aria-label="Add to cart"
                  className="btn-primary flex items-center gap-2 transition-all duration-300 disabled:opacity-30 disabled:grayscale"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  <span>Add to cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div
        className={`relative glass-card rounded-2xl overflow-hidden ease-in-out transition-transform duration-700 group ${
          isOutOfStock ? "cursor-not-allowed" : "hover:-translate-y-1.25"
        }`}
      >
        {/* category badges */}
        <div className={`absolute top-4 left-4 z-10 space-x-2 ${dim}`}>
          {product?.subcategory.categories.map((category) => (
            <span
              className="bg-zinc-900/80 backdrop-blur-md text-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
              key={category.category.name}
            >
              {category.category.name}
            </span>
          ))}
        </div>

        {/* heart button: no dimming */}
        <button
          type="button"
          aria-label={
            wishlistUnavailable
              ? "Wishlist temporarily unavailable"
              : active || activeCtx
                ? "Remove from wishlist"
                : "Add to wishlist"
          }
          title={
            wishlistUnavailable
              ? "Wishlist temporarily unavailable. Please try again later."
              : ""
          }
          disabled={
            isAuthLoading ||
            (!!user && isPendingWishlist) ||
            wishlistUnavailable ||
            isAddingToWishlist ||
            isDeletingWishlistItem
          }
          className={`absolute z-10 top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 text-header cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${active || activeCtx ? "bg-accent" : "bg-zinc-900/40 enabled:hover:bg-zinc-900/80"} ${
            addToWishlistError || deleteWishlistItemError || wishlistUnavailable
              ? "border border-red-500"
              : ""
          }`}
          onClick={() => handleAddDeleteWishlistItem(product.id)}
        >
          <Heart
            size={16}
            color={active || activeCtx ? "#000" : "#fff"}
            fill={active || activeCtx ? "#000" : "none"}
          />
        </button>

        {/* image */}
        <div
          className={`overflow-hidden cursor-pointer aspect-4/3 bg-zinc-900 ${dim}`}
        >
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            {!imgError ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-main text-xs font-bold p-4 text-center">
                {product.title}
              </div>
            )}
          </Link>
        </div>

        {/* body */}
        <div className={`space-y-6 p-5 ${dim}`}>
          <div className="flex items-center justify-between gap-2 text-xs text-main mb-1.5">
            <span>{product.subcategory?.name}</span>
            {product.ratingsAverage ? (
              <span className="flex items-center gap-1 text-accent font-bold tabular-nums">
                <Star size={12} fill="#ffde21" />
                <span>{product.ratingsAverage.toFixed(1)}</span>
              </span>
            ) : (
              <span className="text-[11px] text-main/60">No reviews</span>
            )}
          </div>

          <div>
            <Link
              to={`/product/${product.id}`}
              className="text-header font-bold text-lg hover:text-accent transition-colors line-clamp-1"
            >
              {product.title}
            </Link>
            <p className="text-main text-xs mt-1" key={product.description}>
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <p className="text-main text-[10px] uppercase font-bold tracking-widest">
                Price
              </p>
              {product.discountPrice ? (
                <div className="flex items-baseline gap-2">
                  <p className="text-header font-black text-2xl tabular-nums">
                    {product.discountPrice.toFixed(2)} €
                  </p>
                  <span className="text-main text-xs line-through tabular-nums">
                    {" "}
                    {product.price.toFixed(2)} €
                  </span>
                </div>
              ) : (
                <div className="gap-2">
                  <p className="text-header font-black text-2xl tabular-nums">
                    {product.price.toFixed(2)} €
                  </p>
                </div>
              )}
            </div>
            {isAddedToCart ? (
              <p className="self-end-safe text-green-500">Added to cart</p>
            ) : isOutOfStock ? (
              <p className="self-end-safe text-red-500">Out of stock</p>
            ) : (
              <button
                aria-label="Add to cart"
                className="cursor-pointer bg-accent text-zinc-950 p-3 rounded-xl hover:bg-accent-hover transition-all duration-300 disabled:opacity-30 disabled:grayscale"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCard;
