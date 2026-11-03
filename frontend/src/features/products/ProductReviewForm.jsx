import StarsList from "../../components/StarsList";
import { AlertCircle } from "lucide-react";

function ProductReviewForm({
  refContainer,
  onSubmit,
  setReviewField,
  currentReview,
  isSubmittingReview,
  submitReviewError,
  modal = false,
}) {
  return (
    <form
      className={`space-y-3 ${!modal && "border-t border-white/5 pt-4"}`}
      onSubmit={onSubmit}
    >
      <h3 className="text-header text-sm font-bold">Write a Customer Review</h3>
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
        {isSubmittingReview ? "Subimtting..." : "Submit Review"}
      </button>
      {submitReviewError && (
        <p className="text-red-400 text-xs flex items-center gap-2 mt-2">
          <AlertCircle size={14} />
          {submitReviewError.message}
        </p>
      )}
    </form>
  );
}

export default ProductReviewForm;
