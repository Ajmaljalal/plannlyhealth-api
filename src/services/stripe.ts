import stripe from "../configs/stripe";

const stripeInstance = stripe();

export const createStripeProduct = async (name: string) => {
  const product = await stripeInstance.products.create({
    name,
  });
  return product;
}

export const createStripePrice = async (productId: string, unitAmount: number, interval: any) => {
  const price = await stripeInstance.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency: 'usd',
    recurring: {
      interval: interval || 'month',
    },
  });
  return price;
}

export const createStripeSubscription = async (customerId: string, priceId: string) => {
  const subscription = await stripeInstance.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],

  });
  return subscription;
}

export const createStripeCustomer = async (email: string) => {
  const customer = await stripeInstance.customers.create({
    email,
  });
  return customer;
}

export const createStripIssuingCard = async (cardHolderId: string, additionalCardData: any) => {
  const card = await stripeInstance.issuing.cards.create({
    cardholder: cardHolderId,
    currency: 'usd',
    type: 'virtual',
    ...additionalCardData
  });
  return card;
}

export const createStripeIssuingCardHolder = async (customerId: string, additionalCardHolderData: any) => {
  const cardHolder = await stripeInstance.issuing.cardholders.create({
    type: 'individual',
    customer: customerId,
    ...additionalCardHolderData
  });
  return cardHolder;
}

export const updateStripeIssuingCard = async (cardId: string, updates: any) => {
  const card = await stripeInstance.issuing.cards.update(cardId, {
    ...updates
  });
  return card;
}

export const updateStripeIssuingCardHolder = async (cardHolderId: string, updates: any) => {
  const cardHolder = await stripeInstance.issuing.cardholders.update(cardHolderId, {
    ...updates
  });
  return cardHolder;
}

export const getStripeIssuingCard = async (cardId: string) => {
  const card = await stripeInstance.issuing.cards.retrieve(cardId);
  return card;
}

export const getStripeIssuingCardHolder = async (cardHolderId: string) => {
  const cardHolder = await stripeInstance.issuing.cardholders.retrieve(cardHolderId);
  return cardHolder;
}





