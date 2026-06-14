import { Heart, Share, Star, AlertCircle, ShoppingCart } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProducts } from "../api/useProducts";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProduct } from "../api/useProduct";

function ProductDetailPage() {
  const { product = {}, isFetching } = useProduct();

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [itemCount, setItemCount] = useState(1);

  const { onAddCartProducts } = useCart();
  const { wishlistProducts, onAddToWishlist } = useWishlist();

  const active = wishlistProducts.find(
    (wishlistProdId) => wishlistProdId === product.id,
  );

  return (
    <main>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <section>
            <div className="aspect-4/5 rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 mb-6">
              <img
                src={product.imageUrl}
                alt={`Product view 1`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer hover:border-accent transition-colors"
                >
                  <img
                    src={`https://picsum.photos/seed/prod-${i}/400/400`}
                    alt={`Product view 1`}
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </section>
          <section>
            <header>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-accent text-xs font-black tracking-widest uppercase">
                  {product.productCategories.map((category) => (
                    <p key={category.category.name}>{category.category.name}</p>
                  ))}
                  /
                  {product.productSubcategories.map((subcategory) => (
                    <p key={subcategory.subcategory.name}>
                      {subcategory.subcategory.name}
                    </p>
                  ))}
                </div>
                <p className="flex items-center gap-1 text-accent">
                  <Star size={13} />
                  <span className="text-sm font-bold text-white">4.8</span>{" "}
                  <span className="text-zinc-500 text-xs">(128 reviews)</span>
                </p>
              </div>
              <h1 className="text-4xl mb-4 space-y-10 md:text-5xl font-black tracking-tighter text-white leading-tight">
                {product.title}
              </h1>
              <p className="text-4xl font-black text-white mb-8">
                {product.currency}
                {product.price}
                <span className="line-through text-zinc-500 text-lg">
                  {" "}
                  516.00
                </span>
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-sm mb-4">
                <AlertCircle size={20} />
                <p>Only 8 left in stock</p>
              </div>
            </header>
            <form>
              <fieldset>
                <legend className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                  Select Color
                </legend>
                <div className="flex flex-wrap gap-2 space-y-2">
                  {product.variants.colors.map((productColor) => (
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${color === productColor ? "bg-white text-zinc-950" : "hover:bg-zinc-800"}`}
                      key={productColor}
                      onClick={() => setColor(productColor)}
                    >
                      {productColor}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                  Select Size
                </legend>
                <div className="flex flex-wrap gap-2 space-y-2">
                  {product.variants.sizes.map((productSize) => (
                    <button
                      type="button"
                      key={productSize}
                      className={`w-12 h-12 rounded-lg text-sm font-bold flex items-center justify-center transition-all  ${productSize === size ? "bg-accent text-zinc-950" : "hover:bg-zinc-800 bg-zinc-900 text-zinc-400"} `}
                      onClick={() => setSize(productSize)}
                    >
                      {productSize}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mb-10">
                <div className="flex items-center justify-center bg-zinc-900 rounded-xl border border-white/5 px-2">
                  <button
                    type="button"
                    className="p-3 text-zinc-400 hover:text-white cursor-pointer"
                    aria-label="Decrease item count"
                    onClick={() =>
                      setItemCount((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-white">
                    {itemCount}
                  </span>
                  <button
                    type="button"
                    className="p-3 text-zinc-400 hover:text-white cursor-pointer"
                    aria-label="Increase item count"
                    onClick={() => setItemCount((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="btn-primary grow flex items-center justify-center gap-3 relative overflow-hidden"
                  onClick={() => {
                    // onAddTotalCartCount(itemCount);
                    onAddCartProducts(product.id, itemCount);
                  }}
                >
                  <ShoppingCart size={20} />
                  <span>Add to cart</span>
                </button>
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className={`flex justify-center p-4 rounded-xl border transition-all bg-zinc-900   ${active ? "border border-accent text-accent" : "text-zinc-400 border-white/5 hover:text-white"}`}
                  onClick={() => onAddToWishlist(product.id)}
                >
                  <Heart size={24} fill={`${active ? "#ffde21" : "none"}`} />
                </button>
                <button
                  type="button"
                  className="flex justify-center p-4 rounded-xl border transition-all bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
                >
                  <Share aria-label="Share the product" size={24} />
                </button>
              </div>
            </form>
            <section className="pt-10 border-t border-white/5">
              <div className="mb-4">
                <h3 className="text-white font-bold text-lg uppercase tracking-tight">
                  Product Description
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg uppercase tracking-tight">
                  Features & Details
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {product.extendedDescription}
                </p>
              </div>
            </section>
          </section>
        </article>
      )}
    </main>
  );
}

export default ProductDetailPage;
