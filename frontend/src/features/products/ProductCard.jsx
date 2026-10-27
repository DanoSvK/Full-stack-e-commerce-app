import { Heart, ShoppingCart, Star, CheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCreateWishlistItem } from "../wishlist/useCreateWishlistItem";
import { useWishlist } from "../wishlist/useWishlist";
import { useDeleteWishlistItem } from "../wishlist/useDeleteWishlistItem";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, layout = "grid" }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { onAddCartProducts } = useCart();
  const { user, isAuthLoading } = useAuth();
  const [imgError, setImgError] = useState(false);

  const navigate = useNavigate();

  const {
    data: wishlist,
    isPending: isPendingWishlist,
    error: wishlistError,
  } = useWishlist();

  const { addToWishlist, isAddingToWishlist, addToWishlistError } =
    useCreateWishlistItem();

  const {
    deleteWishlistItem,
    isDeletingWishlistItem,
    deleteWishlistItemError,
  } = useDeleteWishlistItem();

  const active = wishlist?.some((prod) => prod.productId === product?.id);

  function handleAddDeleteWishlistItem(productId) {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!active) {
      addToWishlist(productId);
    } else {
      deleteWishlistItem(productId);
    }
  }

  if (layout === "list") {
    return (
      <div
        className={`relative flex glass-card rounded-2xl overflow-hidden p-5 group ${product.stock === 0 && "pointer-events-none opacity-50 cursor-not-allowed"}`}
      >
        <div className="overflow-hidden cursor-pointer">
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

        <div className="space-y-6 p-5 flex-1">
          <div className="flex items-center justify-between gap-2 text-xs text-main mb-1.5">
            <div className="space-x-2">
              <span className="bg-zinc-900/80 backdrop-blur-md text-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {product.subcategory.categories[0].category.name}
              </span>
              <span className="bg-zinc-900/80 backdrop-blur-md text-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {product.subcategory.name}
              </span>
            </div>

            {product.ratingsAverage && (
              <span className="flex items-center gap-1 font-bold tabular-nums">
                <Star size={12} fill="#ffde21" color="#ffde21" />
                <span className="text-accent">
                  {product.ratingsAverage.toFixed(1)}
                </span>
                <span>({product.ratingsQuantity})</span>
              </span>
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

        <div className="flex flex-col items-center justify-around">
          <div>
            <p className="text-main text-[10px] uppercase font-bold tracking-widest">
              Price
            </p>
            <p className="text-header font-black text-xl">
              {product.price.toFixed(2)} €
            </p>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Add to wishlist"
              disabled={
                isAuthLoading ||
                (!!user && isPendingWishlist) ||
                isAddingToWishlist ||
                isDeletingWishlistItem
              }
              className={`flex items-center justify-center p-3 rounded-xl border border-white/10 hover:border-accent/40 backdrop-blur-md transition-all duration-300 text-header cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                active
                  ? "bg-accent"
                  : "bg-zinc-900/40 enabled:hover:bg-zinc-900/80"
              } ${addToWishlistError || deleteWishlistItemError ? "border border-red-500" : ""}`}
              onClick={() => handleAddDeleteWishlistItem(product.id)}
            >
              <Heart
                size={18}
                color={active ? "#000" : "#fff"}
                fill={active ? "#000" : "none"}
              />
            </button>
            {isAddedToCart ? (
              <button disabled className="btn-primary flex items-center gap-2">
                <CheckIcon size={20} />
                <span>Added</span>
              </button>
            ) : product.stock === 0 ? (
              <button disabled className="btn-primary flex items-center gap-2">
                <span>Out of stock</span>
              </button>
            ) : (
              <button
                aria-label="Add to cart"
                className="btn-primary flex items-center gap-2 transition-all duration-300 disabled:opacity-30 disabled:grayscale"
                onClick={() => {
                  {
                    onAddCartProducts(product.id, 1);
                    setIsAddedToCart(true);
                  }
                }}
              >
                <ShoppingCart size={20} />
                <span>Add to cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div
        className={`relative glass-card rounded-2xl overflow-hidden hover:-translate-y-1.25 ease-in-out transition-transform duration-700 group ${product.stock === 0 && "pointer-events-none opacity-50 cursor-not-allowed"}`}
      >
        <div className="absolute top-4 left-4 z-10 space-x-2">
          {product?.subcategory.categories.map((category) => (
            <span
              className="bg-zinc-900/80 backdrop-blur-md text-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
              key={category.category.name}
            >
              {category.category.name}
            </span>
          ))}
        </div>
        <button
          aria-label="Add to wishlist"
          disabled={
            isAuthLoading ||
            (!!user && isPendingWishlist) ||
            isAddingToWishlist ||
            isDeletingWishlistItem
          }
          className={`absolute z-10 top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 text-header cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${active ? "bg-accent" : "bg-zinc-900/40 enabled:hover:bg-zinc-900/80"} ${addToWishlistError || deleteWishlistItemError ? "border border-red-500" : ""}`}
          onClick={() => handleAddDeleteWishlistItem(product.id)}
        >
          <Heart
            size={16}
            color={active ? "#000" : "#fff"}
            fill={active ? "#000" : "none"}
          />
        </button>

        <div className="overflow-hidden cursor-pointer aspect-4/3 bg-zinc-900">
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
        <div className="space-y-6 p-5">
          <div className="flex items-center justify-between gap-2 text-xs text-main mb-1.5">
            <span>{product.subcategory?.name}</span>
            {product.ratingsAverage && (
              <span className="flex items-center gap-1 text-accent font-bold tabular-nums">
                <Star size={12} fill="#ffde21" />
                <span>{product.ratingsAverage.toFixed(1)}</span>
              </span>
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
              <p className="text-header font-black text-xl">
                {product.price.toFixed(2)} €
              </p>
            </div>
            {isAddedToCart ? (
              <p className="self-end-safe text-green-500">Added to cart</p>
            ) : product.stock === 0 ? (
              <p className="self-end-safe text-red-500">Out of stock</p>
            ) : (
              <button
                aria-label="Add to cart"
                className="cursor-pointer bg-accent text-zinc-950 p-3 rounded-xl hover:bg-accent-hover transition-all duration-300 disabled:opacity-30 disabled:grayscale"
                onClick={() => {
                  {
                    onAddCartProducts(product.id, 1);
                    setIsAddedToCart(true);
                  }
                }}
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
