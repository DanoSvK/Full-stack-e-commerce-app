export function buildPagination(currentPage, totalPages) {
  const pages = new Set();

  pages.add(1);
  pages.add(totalPages);

  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 0 && i <= totalPages) {
      pages.add(i);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);

  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]);

    const next = sorted[i + 1];

    if (next && next - sorted[i] > 1) {
      result.push("...");
    }
  }

  return result;
}
