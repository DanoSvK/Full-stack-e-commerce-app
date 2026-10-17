import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { buildPagination } from "../utils/pagination";

function Pagination({ paginationDetails }) {
  const totalPages = paginationDetails?.totalPages ?? 0;
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    Math.max(totalPages, 1),
  );

  const pagination = buildPagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  function handlePageClick(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (page === 1) {
        next.delete("page");
      } else {
        next.set("page", String(page));
      }

      return next;
    });
  }

  return (
    <nav
      aria-label="Product pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {/* Previous page */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 text-main transition-colors hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-main"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {/* Page numbers and ellipses */}
      {pagination.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="flex h-10 w-6 items-center justify-center text-zinc-500"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            type="button"
            onClick={() => handlePageClick(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`cursor-pointer flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-colors ${
              page === currentPage
                ? "border-accent/50 bg-accent/10 text-accent shadow-[0_0_20px_rgba(255,222,33,0.12)]"
                : "border-white/10 bg-zinc-900/50 text-main hover:border-accent/40 hover:text-accent"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next page */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 text-main transition-colors hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-main"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
