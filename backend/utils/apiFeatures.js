// Converts URL query params into a Prisma-compatible `where` object
// Supported operators: gte, lte, gt, lt, ne
const buildPrismaWhere = (query) => {
  const where = {};

  for (const [key, value] of Object.entries(query)) {
    // 1. Explicit categories logic checks
    if (key === "category") {
      where.productCategories = { some: { category: { slug: value } } };
      continue;
    }
    if (key === "subcategory") {
      where.productSubcategories = { some: { subcategory: { slug: value } } };
      continue;
    }

    // 2. Scan for suffixes
    const match = key.match(/(.+)_(gte|lte|gt|lt|ne|e)/);

    // CASE 1: Simple equality baseline
    if (!match) {
      if (key === "title") {
        where[key] = { contains: value, mode: "insensitive" };
      } else {
        where[key] = value;
      }
      continue;
    }

    // CASE 2: Match processed successfully
    const [_, field, op] = match;

    // Convert shorthand keys safely to official Prisma vocabulary mapping
    let prismaOp = op;
    if (op === "ne") prismaOp = "not";
    if (op === "e") prismaOp = "equals";

    if (!where[field]) where[field] = {};

    // Only convert to a number if the string actually represents numeric data
    const isNumeric = !isNaN(value) && !isNaN(parseFloat(value));
    where[field][prismaOp] = isNumeric ? Number(value) : value;
  }

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
    const page = Number(this.queryString.page) || 1;
    const pageSize = Number(this.queryString.limit) || 10;

    this.prismaQuery.skip = (page - 1) * pageSize;
    this.prismaQuery.take = pageSize;

    return this;
  }
}

export default APIFeatures;
