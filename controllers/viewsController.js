const Tour = require('./../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');

exports.alerts = function (req, res, next) {
  const { alert } = req.query;
  if (alert === 'bookings')
    res.locals.alert =
      "Your booking was successfully! Please check your email for confirmation. If your booking doesn't show yp here immediately, please come back later.";
};

exports.getOverview = catchAsync(async function (req, res) {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) And finally render
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async function (req, res) {
  const tour = await Tour.findById(req.params.tourId).populate({
    path: 'reviews',
    select: 'review user rating',
  });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = function (req, res) {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = function (req, res) {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
};

exports.getAccount = catchAsync(async function (req, res) {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
  });
});

exports.getMyTours = catchAsync(async function (req, res, next) {
  // 1)Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned Ids
  const tourIDs = bookings.map((el) => {
    return el.tour;
  });
  const tours = await Tour.find({
    _id: {
      $in: tourIDs,
    },
  });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});
