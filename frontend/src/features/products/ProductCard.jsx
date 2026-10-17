import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCreateWishlistItem } from "../wishlist/useCreateWishlistItem";
import { useWishlist } from "../wishlist/useWishlist";
import { useDeleteWishlistItem } from "../wishlist/useDeleteWishlistItem";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { onAddCartProducts } = useCart();
  const { user, isAuthLoading } = useAuth();

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

      <div className="overflow-hidden cursor-pointer">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
      </div>
      <div className="space-y-6 p-5">
        <div>
          <Link
            to={`/product/${product.id}`}
            className="text-header font-bold text-lg hover:text-accent transition-colors line-clamp-1"
          >
            {product.title}
          </Link>
          <p className="text-main text-xs mt-1" key={product.subcategory.name}>
            {product.subcategory.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
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

export default ProductCard;
