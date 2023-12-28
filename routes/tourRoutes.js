const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTopFiveCheap,
  getToursStats,
  getToursWithIn,
  getDistances,
  uploadTourImages,
  resizeTourImages,
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
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithIn);
// /tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'guide', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('lead-guide', 'admin'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('lead-guide', 'admin'), deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

module.exports = router;
