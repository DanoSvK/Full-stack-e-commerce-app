// Everything that comes from the URL is checked against an allowlist,
// so clients can't filter/sort/select arbitrary columns or request huge pages.

// Defaults are tuned for the products endpoint. Other resources (users,
// reviews, ...) should pass their own config as the second constructor argument.
const DEFAULT_CONFIG = {
  // Fields clients may filter on, and their type.
  // Numbers support title_gte style operators, strings only "contains".
  filters: {
    title: "string",
    price: "number",
    stock: "number",
    ratingsAverage: "number",
  },
  // Fields clients may sort by (?sort=price or ?sort=-price)
  sortable: ["price", "createdAt", "title", "ratingsAverage"],
  // Fields clients may pick with ?fields=a,b. Empty = feature disabled.
  selectable: [],
  // Used when no valid ?sort= is given
  defaultSort: [{ createdAt: "desc" }],
  defaultLimit: 10,
  maxLimit: 50,
};

// Query suffix -> Prisma operator
const OPERATORS = {
  gte: "gte",
  lte: "lte",
  gt: "gt",
  lt: "lt",
  ne: "not",
  e: "equals",
};

// Converts URL query params into a Prisma-compatible `where` object.
// Unknown fields and malformed values are silently ignored.
const buildPrismaWhere = (query, allowedFilters) => {
  const where = {};

  for (const [key, value] of Object.entries(query)) {
    // Only plain strings are accepted (blocks ?price=1&price=2 arrays etc.)
    if (typeof value !== "string" || value === "") continue;

    // e.g. "price_gte" -> field "price", op "gte"
    const match = key.match(/^(.+)_(gte|lte|gt|lt|ne|e)$/);
    const field = match ? match[1] : key;
    const type = allowedFilters[field];

    if (!type) continue; // not whitelisted

    if (type === "string") {
      // Strings: only plain "?title=foo" -> case-insensitive contains
      if (!match) where[field] = { contains: value, mode: "insensitive" };
      continue;
    }

    // type === "number"
    const num = Number(value);
    if (!Number.isFinite(num)) continue;

    if (!match) {
      where[field] = num;
      continue;
    }

    if (typeof where[field] !== "object" || where[field] === null) {
      where[field] = {};
    }
    where[field][OPERATORS[match[2]]] = num;
  }

  return where;
};

class APIFeatures {
  constructor(queryString = {}, config = {}) {
    this.queryString = queryString;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.prismaQuery = { where: {} };

    // Filled in by paginate(), read these in your controller
    this.page = 1;
    this.pageSize = this.config.defaultLimit;
  }

  filter() {
    const queryObj = { ...this.queryString };

    ["page", "sort", "limit", "fields"].forEach((f) => delete queryObj[f]);

    this.prismaQuery.where = buildPrismaWhere(queryObj, this.config.filters);

    return this;
  }

  sort() {
    const { sortable, defaultSort } = this.config;
    const raw = this.queryString.sort;

    let orderBy = [];

    if (typeof raw === "string") {
      orderBy = raw
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f && sortable.includes(f.replace(/^-/, "")))
        .map((f) =>
          f.startsWith("-") ? { [f.slice(1)]: "desc" } : { [f]: "asc" },
        );
    }

    if (orderBy.length === 0) orderBy = defaultSort;

    // Tie-breaker so pages are stable when many rows share the same value
    this.prismaQuery.orderBy = [...orderBy, { id: "asc" }];

    return this;
  }

  fieldLimit() {
    const { selectable } = this.config;
    const raw = this.queryString.fields;

    if (typeof raw !== "string" || selectable.length === 0) return this;

    const fields = raw
      .split(",")
      .map((f) => f.trim())
      .filter((f) => selectable.includes(f));

    // Note: Prisma can't combine `select` with `include` in the same query.
    // Only use fieldLimit() on endpoints that don't use `include`.
    if (fields.length > 0) {
      this.prismaQuery.select = Object.fromEntries(
        fields.map((f) => [f, true]),
      );
    }

    return this;
  }

  paginate() {
    const { defaultLimit, maxLimit } = this.config;

    const page = Math.max(1, Math.floor(Number(this.queryString.page)) || 1);
    const requested =
      Math.floor(Number(this.queryString.limit)) || defaultLimit;
    const pageSize = Math.min(maxLimit, Math.max(1, requested));

    this.page = page;
    this.pageSize = pageSize;

    this.prismaQuery.skip = (page - 1) * pageSize;
    this.prismaQuery.take = pageSize;

    return this;
  }

  // Ready-made pagination info for the response, uses the capped values
  paginationInfo(total) {
    return {
      total,
      page: this.page,
      pageSize: this.pageSize,
      totalPages: Math.ceil(total / this.pageSize),
    };
  }
}

export default APIFeatures;
