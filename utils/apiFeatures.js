const Tour = require('./../models/tourModel');

function apiFeatures(reqQuery) {
  const queryObj = { ...reqQuery };
  // 1A) Filtering
  const excludeFields = ['fields', 'page', 'sort', 'limit'];
  excludeFields.forEach((el) => delete queryObj[el]);
  //  1B) Adv. Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);
  const obj = JSON.parse(queryStr);
  let query = Tour.find();
  console.log('Query' + query);
  // find({rating: {$lt: 3}})

  // 2) Sorting
  if (reqQuery.sort) {
    const sortBy = reqQuery.sort.split(',').join(' ');
    query = query.sort(sortBy);
    // sort(price avereageRating)
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Field limiting
  if (reqQuery.fields) {
    query = query.select(reqQuery.fields.split(',').join(' '));
    // select(price averageRating)
  } else {
    query = query.select('-__v');
  }

  //  4) Pagination
  const page = Number(reqQuery.page) || 1;
  const limit = Number(reqQuery.limit) || 100;
  const skip = (page - 1) * limit;

  if (skip >= page) {
    query = query.skip(skip).limit(limit);
  }
  console.log(query);

  return query;
}

module.exports = apiFeatures;
