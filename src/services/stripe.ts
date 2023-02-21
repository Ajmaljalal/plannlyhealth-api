import stripe from "../configs/stripe";

const stripeInstance = stripe();

export const createStripeConnectAccount = async (email: string) => {
  try {
    const account = await stripeInstance.accounts.create({
      type: 'express',
      country: 'US',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      email

    });
    return account;
  } catch (error) {
    return error;
  }
}

export const createStripeConnectAccountLink = async (accountId: string) => {
  try {
    const accountLink = await stripeInstance.accountLinks.create({
      account: accountId,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });
    return accountLink;
  }
  catch (error) {
    return error;
  }
}

export const createStripeProduct = async (name: string) => {
  try {
    const product = await stripeInstance.products.create({
      name,
    });
    return product;
  } catch (error) {
    return error;
  }
}

export const createStripePrice = async (productId: string, unitAmount: number, interval: any) => {
  try {
    const price = await stripeInstance.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency: 'usd',
      recurring: {
        interval: interval || 'month',
      },
    });
    return price;
  } catch (error) {
    return error;
  }
}

export const createStripeSubscription = async (customerId: string, priceId: string) => {
  try {
    const subscription = await stripeInstance.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    return error;
  }
}

export const createStripeCustomer = async (email: string) => {
  try {
    const customer = await stripeInstance.customers.create({
      email,
    });
    return customer;
  }
  catch (error) {
    return error;
  }
}

export const createStripIssuingCard = async (cardHolderId: string, additionalCardData: any) => {
  try {
    const card = await stripeInstance.issuing.cards.create({
      cardholder: cardHolderId,
      currency: 'usd',
      type: 'virtual',
      ...additionalCardData
    });
    return card;
  } catch (error) {
    return error;
  }
}

export const createStripeIssuingCardHolder = async (customerId: string, additionalCardHolderData: any) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.create({
      type: 'individual',
      customer: customerId,
      ...additionalCardHolderData
    });
    return cardHolder;
  } catch (error) {
    return error;
  }
}

export const updateStripeIssuingCard = async (cardId: string, updates: any) => {
  try {
    const card = await stripeInstance.issuing.cards.update(cardId, {
      ...updates
    });
    return card;
  } catch (error) {
    return error;
  }
}

export const updateStripeIssuingCardHolder = async (cardHolderId: string, updates: any) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.update(cardHolderId, {
      ...updates
    });
    return cardHolder;
  } catch (error) {
    return error;
  }
}

export const getStripeIssuingCard = async (cardId: string) => {
  try {
    const card = await stripeInstance.issuing.cards.retrieve(cardId);
    return card;
  } catch (error) {
    return error;
  }
}

export const getStripeIssuingCardHolder = async (cardHolderId: string) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.retrieve(cardHolderId);
    return cardHolder;
  } catch (error) {
    return error;
  }
}





