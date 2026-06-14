// Converts URL query params into a Prisma-compatible `where` object
// Supported operators: gte, lte, gt, lt, ne
const buildPrismaWhere = (query) => {
  const where = {};

  // Loop through all query parameters from req.query
  for (const [key, value] of Object.entries(query)) {
    // Check if the key contains an operator pattern like "price_gte"
    const match = key.match(/(.+)_(gte|lte|gt|lt|ne)/);

    // First check if query is categroy or subcategory
    if (key === "category") {
      where.productCategories = {
        some: {
          category: {
            slug: value,
          },
        },
      };

      continue;
    }

    if (key === "subcategory") {
      where.productSubcategories = {
        some: {
          subcategory: {
            slug: value,
          },
        },
      };

      continue;
    }

    // CASE 1: No operator → simple equality filter
    // Example: ?category=phone → { category: "phone" }

    if (!match) {
      if (key === "title") {
        where[key] = {
          contains: value,
          mode: "insensitive",
        };
      } else {
        where[key] = value;
      }
      continue;
    }

    // CASE 2: Operator filter detected
    // Example: price_gte → field: price, op: gte
    const [_, field, op] = match;

    // Ensure nested object exists for the field
    // Example: where.price = {}
    if (!where[field]) where[field] = {};

    // Assign operator value
    // Example: where.price.gte = 100
    where[field][op] = Number(value);
  }

  // Return final Prisma-compatible where clause
  return where;
};

class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.prismaQuery = {
      where: {},
    };
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((f) => delete queryObj[f]);

    this.prismaQuery.where = buildPrismaWhere(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.prismaQuery.orderBy = this.queryString.sort
        .split(",")
        .map((field) => {
          if (field.startsWith("-")) {
            return { [field.slice(1)]: "desc" };
          }
          return { [field]: "asc" };
        });
    }

    return this;
  }

  fieldLimit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",");

      this.prismaQuery.select = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    }

    return this;
  }

  paginate() {
    if (this.queryString.page) {
      const page = Number(this.queryString.page) || 1;
      const pageSize = Number(this.queryString.limit) || 10;

      this.prismaQuery.skip = (page - 1) * pageSize;
      this.prismaQuery.take = pageSize;
    }

    return this;
  }
}

export default APIFeatures;
