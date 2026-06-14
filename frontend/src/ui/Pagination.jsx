import { useState } from "react";
import { buildPagination } from "../utils/pagination";
import { useSearchParams } from "react-router-dom";

const TOTAL_PAGES = 5;

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const pagination = buildPagination(currentPage, TOTAL_PAGES);
  const [searchParams, setSearchParams] = useSearchParams();

  function handlePageClick(page) {
    setCurrentPage(page);
    setSearchParams((prev) => {
      const next = { ...prev };

      next.page = page;

      return next;
    });
  }

  console.log(pagination);
  return (
    <div className="flex gap-2">
      {pagination.map((p) =>
        p === "..." ? (
          <span>{p}</span>
        ) : (
          <button
            type="button"
            key={`page-${p}`}
            className={currentPage === p ? "bg-mist-800" : "cursor-pointer"}
            onClick={() => handlePageClick(p)}
          >
            {p}
          </button>
        ),
      )}
    </div>
  );
}

export default Pagination;
