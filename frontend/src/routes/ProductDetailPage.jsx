import {
  Heart,
  Share,
  Star,
  ShoppingCart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  MessageSquarePlus,
  AlertCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../features/wishlist/useWishlist";
import { useCreateWishlistItem } from "../features/wishlist/useCreateWishlistItem";
import { useProduct } from "../features/products/useProduct";
import { useDeleteWishlistItem } from "../features/wishlist/useDeleteWishlistItem";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../features/products/useReviews";
import { useAddReview } from "../features/products/useAddReview";

import ProductDetailPageSkeleton from "../components/skeletons/ProductDetailPageSkeleton";
import LoaderError from "../ui/LoaderError";
import StarsList from "../components/StarsList";
import ReviewSkeleton from "../components/skeletons/ReviewSkeleton";
import Pagination from "../ui/Pagination";

function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [itemCount, setItemCount] = useState(1);
  const [selectedImage, setSelectedImage] = useState(1);
  const refContainer = useRef(null);

  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();

  const {
    data: product,
    isPending: isFetchingProduct,
    error: productError,
  } = useProduct();

  const { onAddCartProducts } = useCart();

  const {
    data: wishlist,
    isPending: isPendingWishlist,
    isFetching: isFetchingWishlist,
    error: wishlistError,
  } = useWishlist(!isAuthLoading && !!user);

  const {
    data: reviewsData,
    isPending: isPendingReviews,
    error: reviewsError,
    refetch,
    isFetching: isFetchingReviews,
  } = useReviews();

  const { submitReview, isSubmittingReview, submitReviewError } =
    useAddReview();

  const { addToWishlist, isAddingToWishlist, addToWishlistError } =
    useCreateWishlistItem();

  const {
    deleteWishlistItem,
    isDeletingWishlistItem,
    deleteWishlistItemError,
  } = useDeleteWishlistItem();

  const reviews = reviewsData?.data?.reviews ?? [];
  const paginationDetails = reviewsData?.pagination;
  const userReview = reviews.find((review) => review.user.id === user.id);
  const [review, setReview] = useState(null);

  const initialReview = {
    rating: userReview?.rating ?? 0,
    title: userReview?.title ?? "",
    comment: userReview?.comment ?? "",
  };

  const currentReview = review ?? initialReview;

  if (isFetchingProduct) {
    return <ProductDetailPageSkeleton />;
  }

  if (productError) {
    return <LoaderError />;
  }

  const color = selectedColor ?? product?.variants?.colors?.[0] ?? "";
  const size = selectedSize ?? product?.variants?.sizes?.[0] ?? "";

  const stockLevelMsg =
    product.stock > 5
      ? "More than 5 in stock"
      : product.stock === 5
        ? "5 in stock"
        : "Less than 5 in stock";

  const stockLevelColor =
    product.stock > 5
      ? "text-emerald-400"
      : product.stock === 5
        ? "text-accent"
        : "text-orange-400";

  const active = wishlist?.some((prod) => prod.productId === product.id);

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

  function scrollToReviewForm() {
    document
      .getElementById("review-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    refContainer.current.focus();
  }

  function handleSubmitReview(e) {
    e.preventDefault();

    if (!currentReview.rating) {
      toast.error("Please select a rating"); // import toast from "react-hot-toast"
      return;
    }

    submitReview(currentReview, {
      onSuccess: () => {
        setReview(null);
        refetch();
      },
    });
  }

  function setReviewField(key, value) {
    setReview((prev) => ({
      ...(prev ?? initialReview),
      [key]: value,
    }));
  }

  return (
    <main className="space-y-20">
      <button
        className="inline-flex items-center gap-2 text-xs font-bold text-main hover:text-accent transition-colors mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        <span className="text-xs">Back to catalog</span>
      </button>
      <article className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 max-w-6xl mx-auto">
        <section>
          <div className="aspect-4/5 rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 mb-6">
            <img
              src={`https://picsum.photos/seed/prod-${selectedImage}/400/400`}
              alt={`Product view 1`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(i)}
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
                {product.subcategory.categories.map((category) => (
                  <p key={category.category.name} className="pr-1">
                    {category.category.name}{" "}
                  </p>
                ))}
                /<p className="pl-1">{product.subcategory.slug}</p>
              </div>
              <p className="flex items-center gap-1 text-accent">
                <Star size={13} fill="#ffde21" />
                <span className="text-sm font-bold text-header">
                  {product.ratingsAverage}
                </span>
                <span className="text-main text-xs">
                  ({product.ratingsQuantity} ratings)
                </span>
              </p>
            </div>
            <h1 className="text-4xl mb-4 md:text-5xl font-black tracking-tighter text-header leading-tight">
              {product.title}
            </h1>
            <p className="text-4xl font-black text-header mb-6 tabular-nums">
              {product.price.toFixed(2)} €
              <span className="line-through text-main text-lg font-medium ml-2">
                {" "}
                516.00 €
              </span>
            </p>
            <div
              className={`flex items-center gap-2 font-bold text-sm mb-6 ${stockLevelColor}`}
            >
              <p>{stockLevelMsg}</p>
            </div>
          </header>
          <form className="space-y-6">
            <fieldset>
              <legend className="text-main text-[10px] uppercase font-bold tracking-widest mb-2.5">
                Select Color: <span className="text-header">{color}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((productColor) => (
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border border-white/5 ${productColor === color ? "bg-white text-zinc-950" : "hover:bg-zinc-800 text-zinc-300 bg-zinc-900"}`}
                    key={productColor}
                    onClick={() => setSelectedColor(productColor)}
                  >
                    {productColor}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-main text-[10px] uppercase font-bold tracking-widest mb-2.5">
                Select Size: <span className="text-header">{size}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((productSize) => (
                  <button
                    type="button"
                    key={productSize}
                    className={`min-w-12 h-12 px-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all cursor-pointer border border-white/5  ${productSize === size ? "bg-accent text-zinc-950" : "hover:bg-zinc-800 bg-zinc-900 text-main"} `}
                    onClick={() => setSelectedSize(productSize)}
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
                  className="p-3 text-main hover:text-header cursor-pointer"
                  aria-label="Decrease item count"
                  onClick={() =>
                    setItemCount((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-header">
                  {itemCount}
                </span>
                <button
                  type="button"
                  className="p-3 text-main hover:text-header cursor-pointer"
                  aria-label="Increase item count"
                  onClick={() => setItemCount((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn-primary grow flex items-center justify-center gap-3 relative overflow-hidden"
                disabled={product.stock === 0}
                onClick={() => {
                  onAddCartProducts(product.id, itemCount);
                }}
              >
                <ShoppingCart size={20} />
                <span>
                  {product.stock === 0 ? "Out of stock" : "Add to cart"}
                </span>
              </button>
              <button
                type="button"
                aria-label="Add to wishlist"
                className={`cursor-pointer flex justify-center p-4 rounded-xl border transition-all bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed ${active ? " border-accent text-accent" : "text-main border-white/5 enabled:hover:text-header"} ${addToWishlistError || deleteWishlistItemError ? "border-red-500" : ""}`}
                disabled={
                  isAuthLoading ||
                  (!!user && isPendingWishlist) ||
                  isAddingToWishlist ||
                  isDeletingWishlistItem
                }
                onClick={() => handleAddDeleteWishlistItem(product.id)}
              >
                <Heart size={24} fill={`${active ? "#ffde21" : "none"}`} />
              </button>
              <button
                type="button"
                className="cursor-pointer flex justify-center p-4 rounded-xl border transition-all bg-zinc-900 border-white/5 text-main hover:text-header"
              >
                <Share aria-label="Share the product" size={24} />
              </button>
            </div>
          </form>

          {/* TRUST & SHIPPING PERKS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 pt-2">
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex items-center gap-2.5 text-xs">
              <Truck size={16} className="text-accent shrink-0" />
              <span className="text-zinc-300">Free Express Delivery</span>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex items-center gap-2.5 text-xs">
              <ShieldCheck size={16} className="text-accent shrink-0" />
              <span className="text-zinc-300">2-Year Official Warranty</span>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex items-center gap-2.5 text-xs">
              <RotateCcw size={16} className="text-accent shrink-0" />
              <span className="text-zinc-300">30-Day Free Returns</span>
            </div>
          </div>

          {/* DESCRIPTIONS & DETAILS */}
          <section className="pt-10 border-t border-white/5">
            <div className="mb-4">
              <h3 className="text-header font-bold text-lg uppercase tracking-tight">
                Product Description
              </h3>
              <p className="text-main leading-relaxed">{product.description}</p>
            </div>
            <div>
              <h3 className="text-header font-bold text-lg uppercase tracking-tight">
                Features & Details
              </h3>
              <p className="text-main text-sm leading-relaxed">
                {product.extendedDescription}
              </p>
            </div>
          </section>
        </section>
      </article>

      {/* RATINGS */}
      <section className="max-w-6xl mx-auto pt-12 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div id="review-form" className="space-y-6">
          <div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
              VERIFIED FEEDBACK
            </p>
            <h2 className="text-3xl font-black tracking-tighter text-header uppercase">
              CUSTOMER REVIEWS
            </h2>
          </div>
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-baseline gap-3">
              <p
                className={`text-5xl font-black tabular-nums ${product.ratingsAverage === 0 ? "text-zinc-600" : "text-accent"}`}
              >
                {product.ratingsAverage.toFixed(1)}
              </p>
              <div className="flex flex-col">
                <StarsList len={5} ratingsCount={product.ratingsQuantity} />
                <p className="text-main text-xs mt-1">
                  {product.ratingsQuantity === 0
                    ? "No ratings yet · Be the first to review"
                    : `Based on ${product.ratingsQuantity} reviews`}
                </p>
              </div>
            </div>
            {/* ADD REVIEW FORM */}
            <form
              className="space-y-3 pt-4 border-t border-white/5"
              onSubmit={handleSubmitReview}
            >
              <h3 className="text-header text-sm font-bold">
                Write a Customer Review
              </h3>
              <label className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1">
                Your Rating
              </label>
              <StarsList
                len={5}
                interactive={true}
                setReviewField={setReviewField}
                defaultRating={currentReview.rating}
              />
              <input
                className="input-field w-full text-xs"
                placeholder="Headline (e.g. Incredible build quality)"
                ref={refContainer}
                value={currentReview.title}
                onInput={(e) => {
                  setReviewField("title", e.target.value);
                }}
              />
              <textarea
                className="input-field w-full text-xs"
                placeholder="Share your experience with this product..."
                value={currentReview.comment}
                onInput={(e) => {
                  setReviewField("comment", e.target.value);
                }}
              ></textarea>
              <button
                disabled={isSubmittingReview}
                className="btn-primary w-full text-xs py-2.5 uppercase"
              >
                {userReview
                  ? "Update Review"
                  : isSubmittingReview
                    ? "Subimtting..."
                    : "Submit Review"}
              </button>
              {submitReviewError && (
                <p className="text-red-400 text-xs flex items-center gap-2 mt-2">
                  <AlertCircle size={14} />
                  {submitReviewError.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* USER REVIEWS */}
        <div className="lg:col-span-2 space-y-4">
          {isPendingReviews ? (
            <ReviewSkeleton />
          ) : reviewsError ? (
            <LoaderError
              message={"Couldn´t load reviews"}
              onRetry={refetch}
              isRetrying={isFetchingReviews}
            />
          ) : !reviews.length ? (
            <div className="py-16 px-8 text-center space-y-4 bg-zinc-900/30 rounded-[40px] border border-dashed border-zinc-800 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600">
                <MessageSquarePlus size={32} />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-black tracking-tighter text-header uppercase">
                  No Reviews Yet
                </h3>
                <p className="text-main text-sm leading-relaxed">
                  There are no customer reviews for{" "}
                  <strong className="text-zinc-200">{product.title}</strong>{" "}
                  yet. Have you tried this item? Share your experience and help
                  other shoppers decide.
                </p>
              </div>
              <button
                className="btn-secondary text-xs py-2.5 px-5 mt-2"
                onClick={() => scrollToReviewForm()}
              >
                Write the First Review
              </button>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="glass-card p-6 rounded-2xl space-y-3 border border-white/5"
              >
                <div className="flex gap-2">
                  <StarsList len={5} />
                  <p className="text-header font-bold text-sm">
                    {review.title}
                  </p>
                </div>
                <p>{review.comment}</p>
                <div className="flex items-center gap-3 text-xs text-main pt-1">
                  <span className="font-semibold text-zinc-200">
                    {review.user.username}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Verified Purchase
                  </span>
                  <span>·</span>
                  <span>Awesome Iceblue·126GB</span>
                </div>
              </article>
            ))
          )}
          <Pagination paginationDetails={paginationDetails} limit={3} />
        </div>
      </section>
    </main>
  );
}

export default ProductDetailPage;
