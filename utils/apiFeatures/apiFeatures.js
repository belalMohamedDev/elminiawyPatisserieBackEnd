class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryObj[field]);

    // Apply filtering for price range
    if (this.queryString.price) {
      const priceRange = this.queryString.price.split("-").map(Number);
      queryObj.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }

    if (this.queryString.active !== undefined) {
      queryObj.active = this.queryString.active === "true" ? true : false;
    }

    // Apply date range filtering

    if (this.queryString.endDate === "true") {
      const now = new Date();
      queryObj.endDate = { $gte: now };
    }

    // Apply filtration using [gte, gt, lte, lt]
    // No need to stringify and replace. You can directly use the query object
    const queryStr = queryObj;

    // Directly pass the query object to Mongoose without string manipulation
    this.mongooseQuery = this.mongooseQuery.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      // Default sort by created date
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  dataLimit() {
    const limit = this.queryString.limit * 1 || null;

    this.mongooseQuery = this.mongooseQuery.limit(limit);

    return this;
  }

  limitfields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const queryKeyword = {};
      if (modelName === "product") {
        queryKeyword.$or = [
          { "title.en": { $regex: this.queryString.keyword, $options: "i" } },
          { "title.ar": { $regex: this.queryString.keyword, $options: "i" } },
          {
            "description.en": {
              $regex: this.queryString.keyword,
              $options: "i",
            },
          },
          {
            "description.ar": {
              $regex: this.queryString.keyword,
              $options: "i",
            },
          },
        ];
      } else {
        queryKeyword.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }
      this.mongooseQuery = this.mongooseQuery.find(queryKeyword);
    }
    return this;
  }

  pagination(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 15;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    const paginationResult = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };

    if (skip + limit < countDocuments) {
      paginationResult.next = page + 1;
    }

    if (skip > 0) {
      paginationResult.prev = page - 1;
    }

    this.paginationResult = paginationResult;
    return this;
  }
}

module.exports = ApiFeatures;
