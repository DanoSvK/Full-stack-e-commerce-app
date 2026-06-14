import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { onAddCartProducts } = useCart();
  const { wishlistProducts, onAddToWishlist } = useWishlist();
  const active = wishlistProducts.includes(product.id);

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden hover:-translate-y-1.25 ease-in-out transition-transform duration-700 group">
      <div className="absolute top-4 left-4 z-10 space-x-2">
        {product.productCategories.map((category) => (
          <span
            className="bg-zinc-900/80 backdrop-blur-md text-zinc-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
            key={category.category.name}
          >
            {category.category.name}
          </span>
        ))}
      </div>
      <button
        aria-label="Add to wishlist"
        className={`absolute z-10 top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300  text-white  ${active ? "bg-accent" : "bg-zinc-900/40 hover:bg-zinc-900/80"}`}
        onClick={() => onAddToWishlist(product.id)}
      >
        <Heart
          size={16}
          color={`${active ? "#000" : "#fff"}`}
          fill={`${active ? "#000" : "none"}`}
        />
      </button>
      <div className="overflow-hidden cursor-pointer">
        <Link to={`/products/${product.id}`}>
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
            href=""
            className="text-white font-bold text-lg hover:text-accent transition-colors line-clamp-1"
          >
            {product.title}
          </Link>
          {product.productSubcategories.map((subcategory) => (
            <p
              className="text-zinc-500 text-xs mt-1"
              key={subcategory.subcategory.name}
            >
              {subcategory.subcategory.name}
            </p>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Price
            </p>
            <p className="text-white font-black text-xl">USD {product.price}</p>
          </div>
          <button
            aria-label="Add to cart"
            className="cursor-pointer bg-accent text-zinc-950 p-3 rounded-xl hover:bg-accent-hover transition-all duration-300 disabled:opacity-30 disabled:grayscale"
            onClick={() => {
              onAddCartProducts(product.id, 1);
            }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
