import stripe from 'stripe';

export default () => {
  return new stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });
}


