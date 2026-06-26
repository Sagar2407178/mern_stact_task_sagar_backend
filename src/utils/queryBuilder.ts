import { Op, WhereOptions, OrderItem } from "sequelize";

interface QueryBuilderOptions {
  query: any;
  searchableFields?: string[];
  defaultSortBy?: string;
  defaultSortOrder?: "ASC" | "DESC";
  defaultLimit?: number;
  fieldMappings?: Record<string, string>;
  arrayFields?: string[];
  excludeFields?: string[];
}

interface QueryResult {
  where: WhereOptions;
  order: OrderItem[];
  limit: number;
  offset: number;
  page: number;
}

/**
 * Transforms standard REST API query parameters into Sequelize-compatible query options.
 */
export const buildQueryOptions = ({
  query,
  searchableFields = [],
  defaultSortBy = "createdAt",
  defaultSortOrder = "DESC",
  defaultLimit = 10,
  fieldMappings = {},
  arrayFields = [],
  excludeFields = [],
}: QueryBuilderOptions): QueryResult => {
  const page = parseInt((query.page as string) || "1", 10);
  const limit = parseInt((query.limit as string) || String(defaultLimit), 10);
  const offset = (page - 1) * limit;

  let where: any = {};

  // 1. Search functionality (matches any of the searchable fields using iLike)
  if (query.search && searchableFields.length > 0) {
    where[Op.or] = searchableFields.map((field) => ({
      [field]: { [Op.iLike]: `%${query.search}%` },
    }));
  }

  // 2. Generic Filtering
  // Exclude standard reserved query params and explicitly excluded fields
  const baseExcludedFields = ["page", "limit", "sortBy", "sortOrder", "search"];
  const allExcludedFields = [...baseExcludedFields, ...excludeFields];

  Object.keys(query).forEach((key) => {
    const baseField = key.includes("__") ? key.split("__")[0] : key;
    if (
      !allExcludedFields.includes(baseField) &&
      query[key] !== undefined &&
      query[key] !== ""
    ) {
      const val = query[key];
      const dbField = fieldMappings[baseField] || baseField;

      if (key.includes("__")) {
        const [, operator] = key.split("__");

        // Initialize the object if it doesn't exist to support multiple operators on the same field
        if (
          !where[dbField] ||
          typeof where[dbField] !== "object" ||
          Array.isArray(where[dbField])
        ) {
          where[dbField] = {};
        }

        const fieldWhere = where[dbField] as any;

        switch (operator) {
          case "is":
          case "eq":
            fieldWhere[Op.eq] = val;
            break;
          case "ne":
            fieldWhere[Op.ne] = val;
            break;
          case "gt":
            fieldWhere[Op.gt] = val;
            break;
          case "gte":
            fieldWhere[Op.gte] = val;
            break;
          case "lt":
            fieldWhere[Op.lt] = val;
            break;
          case "lte":
            fieldWhere[Op.lte] = val;
            break;
          case "in":
            fieldWhere[Op.in] = Array.isArray(val)
              ? val
              : String(val).split(",");
            break;
          case "notIn":
            fieldWhere[Op.notIn] = Array.isArray(val)
              ? val
              : String(val).split(",");
            break;
          case "con":
          case "like":
            fieldWhere[Op.iLike] = `%${val}%`;
            break;
          default:
            // If unknown operator, just treat it as exact match with the full key
            if (Object.keys(fieldWhere).length === 0) {
              delete where[dbField];
            }
            where[dbField] = val;
            break;
        }
      } else {
        if (arrayFields.includes(baseField)) {
          const arrVal = Array.isArray(val) ? val : String(val).split(",");
          where[dbField] = { ...where[dbField], [Op.in]: arrVal };
        } else {
          where[dbField] = val;
        }
      }
    }
  });

  // 3. Sorting logic
  let order: OrderItem[] = [[defaultSortBy, defaultSortOrder]];
  if (query.sortBy) {
    const sortOrder = query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    order = [[query.sortBy as string, sortOrder]];
  }

  return {
    where,
    order,
    limit,
    offset,
    page,
  };
};
