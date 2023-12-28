import axios from 'axios';
import { showAlert } from './alert';

// <script src="http://js.stripe.com/v3/"></script> --- make sure to include in the head

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51ORuzoSJChrrOJZcfGJUd3FLRQbWABXd50XJ8GmQvKjWWjnofU6QaSIbeO0YF7z640vAmVtUlwQyTXPbtzcS93VX0004XpYfVh'
  );
  try {
    //1)Get session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    //2)Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
