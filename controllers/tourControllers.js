const Tour = require('./../models/tourModel');

exports.getTopFiveCheap = function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingAverage';
  next();
};

exports.getAllTours = async function (req, res) {
  try {
    const queryObj = { ...req.query };
    console.log(queryObj);
    // 1A) Filtering
    const excludeFields = ['fields', 'page', 'sort', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);
    //  1B) Adv. Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));
    // find({rating: {$lt: 3}})

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // sort(price avereageRating)
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      query = query.select(req.query.fields.split(',').join(' '));
      // select(price averageRating)
    } else {
      query = query.select('-__v');
    }

    //  4) Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const totalDoc = await Tour.countDocuments();

    if (skip < totalDoc) {
      query = query.skip(skip).limit(limit);
    } else {
      throw new Error(`Cannot find this page number ${page}`);
    }

    const tours = await query;

    res.status(200).json({
      success: true,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async function (req, res) {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).josn({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async function (req, res) {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async function (req, res) {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: updatedTour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async function (req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'No content',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
