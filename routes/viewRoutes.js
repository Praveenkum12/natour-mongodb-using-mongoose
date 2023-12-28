const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getMyTours,
} = require('../controllers/viewsController');
const {
  isloggedIn,
  protect,
} = require('../controllers/authentcationController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isloggedIn, getOverview);
router.get('/tour/:tourId', isloggedIn, getTour);
router.get('/login', isloggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

module.exports = router;