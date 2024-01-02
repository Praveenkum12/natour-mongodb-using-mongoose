const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const Stripe = require('stripe');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async function (req, res, next) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const product = await stripe.products.create({
    name: `${tour.name} Tour`,
    description: tour.summary,
    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: tour.price * 100,
    currency: 'usd',
  });

  // reference:
  // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
  //     req.params.tourId
  //   }&user=${req.user.id}&price=${tour.price}`,

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
  });
  console.log(session);

  // To test successful payments use: 4242 4242 4242 4242
  // To test declined payments use: 4000 0000 0000 0002
  // To test authorised payments (EU) use:  4000 0000 0000 3220

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async function (req, res, next) {
//   // this is only temp, bcause its unsecure: everyone can make booking without paying
//   const { tour, user, price } = req.query;
//   if (!tour && !user && !price) return next();

//   const doc = await Booking.create({ tour, user, price });
//   console.log(doc);
//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async function (session) {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  console.log(session.line_items);
  const price = session.line_items[0].price;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = function (req, res, next) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvents(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.createBooking = createOne(Booking);
exports.getBooking = getOne(Booking);
exports.getAllBookings = getAll(Booking);
exports.updateBooking = updateOne(Booking);
exports.deleteBooking = deleteOne(Booking);
