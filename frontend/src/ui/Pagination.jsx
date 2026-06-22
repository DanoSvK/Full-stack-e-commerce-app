import { useEffect, useState } from "react";
import { buildPagination } from "../utils/pagination";
import { useSearchParams } from "react-router-dom";

function Pagination({ paginationDetails }) {
  const totalPages = paginationDetails?.totalPages;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pagination = buildPagination(currentPage, totalPages);

  function handlePageClick(page) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (page === 1) {
        next.delete("page");
      } else {
        next.set("page", page);
      }
      return next;
    });
  }

  return (
    <div className="flex gap-2">
      {pagination.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`}>{p}</span>
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
