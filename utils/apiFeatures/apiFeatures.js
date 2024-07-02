class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery
    this.queryString = queryString
  }

  filter() {
    const quaryStringObj = { ...this.queryString }
    const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword']
    excludesFields.forEach((field) => delete quaryStringObj[field])

    //apply filteration using [gte,gt,lte,lt]
    let quaryStr = JSON.stringify(quaryStringObj)
    quaryStr = quaryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(quaryStr))
    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.mongooseQuery = this.mongooseQuery.sort(sortBy)
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
    }
    return this
  }

  limitfields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.mongooseQuery = this.mongooseQuery.select(fields)
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v')
    }
    return this
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const queryKeyword = {};
      if (modelName === 'product') {
        queryKeyword.$or = [
          {
            title: {
              $regex: this.queryString.keyword,
              $options: 'i',
            },
          },
          {
            description: {
              $regex: this.queryString.keyword,
              $options: 'i',
            },
          },
        ]
      } else {
        queryKeyword.$or = [
          {
            name: {
              $regex: this.queryString.keyword,
              $options: 'i',
            },
          },
        ]
      }
      this.mongooseQuery = this.mongooseQuery.find(queryKeyword);
    }
    return this;
  }

  pagination(countDocuments) {
    const paginate = {};
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    //paginate result
    paginate.currentPage = page;
    paginate.limit = limit;
    paginate.skip = skip;
    paginate.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      paginate.next = page + 1;
    }
    if (skip > 0) {
      paginate.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationRuslt = paginate;
    return this;
  }
}

module.exports = ApiFeatures;
