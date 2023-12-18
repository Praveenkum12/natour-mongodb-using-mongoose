const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTopFiveCheap,
  getToursStats,
} = require('./../controllers/tourControllers');
const {
  protect,
  restrictTo,
} = require('./../controllers/authentcationController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(getTopFiveCheap, getAllTours);

router.route('/tourstats').get(getToursStats);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'guide', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('lead-guide', 'admin'), updateTour)
  .delete(protect, restrictTo('lead-guide', 'admin'), deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

module.exports = router;
