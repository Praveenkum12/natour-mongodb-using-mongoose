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
const { protect } = require('./../controllers/authentcationController');

const router = express.Router();

router.route('/top-5-cheap').get(getTopFiveCheap, getAllTours);

router.route('/tourstats').get(getToursStats);

router.route('/').get(protect, getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
