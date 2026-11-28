import { useContext, useState } from "react";
import { useCart } from "../context/CartContext";
import { getEffectivePrice } from "../utils/getEffectivePrice";
import { CheckIcon, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteWishlistItem } from "../features/wishlist/useDeleteWishlistItem";
import { WishlistContext } from "../context/WishlistContext";

function WishlistCard({ product, user = {} }) {
  const { cartProducts, onAddOneProduct } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(
    cartProducts.some((cartProduct) => cartProduct.id === product.id),
  );

  const { removeFromWishlistCtx } = useContext(WishlistContext);

  const {
    mutate: deleteWishlistItem,
    isPending: isDeletingWishlistItem,
    error: deleteWishlistItemError,
  } = useDeleteWishlistItem();

  function handleAddToCart(productId) {
    onAddOneProduct(productId);
    setIsAddedToCart(true);
  }

  function handleRemoveFromWishlist(productId) {
    if (user) {
      deleteWishlistItem(productId);
    } else {
      removeFromWishlistCtx(productId);
    }
  }

  return (
    // The parent exists as relative due to delete button living outside the main section so the delete icon is not affected by out of stock UI and hover effect
    <div className="relative">
      <button
        type="button"
        aria-label="Remove item from cart"
        className="absolute z-50 top-7 right-8 text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
        onClick={() => handleRemoveFromWishlist(product.id)}
      >
        <Trash2 size={20} />
      </button>
      <section
        className={`glass-card p-6 rounded-2xl sm:flex sm:items-center sm:gap-4 group ${product.stock === 0 && "pointer-events-none opacity-50 cursor-not-allowed"}`}
        key={product.id}
      >
        <div className="h-36 sm:h-28 w-full sm:w-28 rounded-xl overflow-hidden bg-zinc-900 shrink-0 cursor-pointer">
          <Link to={`/product/${product.id}`}>
            <img src={product.imageUrl} alt={product.title} />
          </Link>
        </div>
        <div className="flex flex-col grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-main text-xs mt-1">
                {product.subcategory.categories.map((category) => (
                  <p key={category.category.name}>{category.category.name}</p>
                ))}
                /<p>{product.subcategory.name}</p>
              </div>
              <Link
                to={`/product/${product.id}`}
                className="text-header font-bold hover:text-accent transition-colors cursor-pointer"
              >
                {product.title}
              </Link>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="sm:flex sm:justify-between sm:items-center pt-2 space-y-3">
            <p className="text-header text-xl font-bold">
              {getEffectivePrice(product).toFixed(2)} €
            </p>
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
                onClick={() => handleAddToCart(product.id)}
              >
                <ShoppingCart size={20} />
                <span>Add to cart</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WishlistCard;
