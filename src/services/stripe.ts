import stripe from "../configs/stripe";

const stripeInstance = stripe();

////// Stripe Customer and Operations //////

export const createStripeCustomerService = async (customerData: any) => {
  try {
    const customer = await stripeInstance.customers.create(customerData);
    return customer;
  }
  catch (error) {
    return error;
  }
}

export const getStripeCustomerService = async (customerId: string) => {
  try {
    const customer = await stripeInstance.customers.retrieve(customerId);
    return customer;
  }
  catch (error) {
    return error;
  }
}

export const updateStripeCustomerService = async (customerId: string, updates: any) => {
  try {
    const customer = await stripeInstance.customers.update(customerId, {
      ...updates
    });
    return customer;
  }
  catch (error) {
    return error;
  }
}

export const createPaymentMethodService = async (paymentMethodData: any) => {
  try {
    const paymentMethod = await stripeInstance.paymentMethods.create({
      type: 'card',
      card: {
        number: paymentMethodData.number,
        exp_month: paymentMethodData.exp_month,
        exp_year: paymentMethodData.exp_year,
        cvc: paymentMethodData.cvc,
      },
    });
    return paymentMethod;
  }
  catch (error) {
    return error;
  }
}

export const updatePaymentMethodService = async (paymentMethodId: string, updates: any) => {
  try {
    const paymentMethod = await stripeInstance.paymentMethods.update(paymentMethodId, {
      ...updates
    });
    return paymentMethod;
  }
  catch (error) {
    return error;
  }
}

export const attachPaymentMethodService = async (customerId: string, paymentMethodId: string) => {
  try {
    const paymentMethod = await stripeInstance.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });
    return paymentMethod;
  }
  catch (error) {
    return error;
  }
}

export const detachPaymentMethodService = async (paymentMethodId: string) => {
  try {
    const paymentMethod = await stripeInstance.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  }
  catch (error) {
    return error;
  }
}

export const chargePaymentMethodService = async (paymentData: any) => {
  try {
    const payment = await stripeInstance.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency || 'usd',
      payment_method: paymentData.paymentMethodId,
      customer: paymentData.customerId,
      confirmation_method: 'manual',
      confirm: true,
    });
    return payment;
  }
  catch (error) {
    return error;
  }
}

////// Stripe Products and Operations //////

export const createStripeProductService = async (productData: any,) => {
  try {
    const product = await stripeInstance.products.create({
      name: productData.name,
      type: 'service',
      description: productData.description,
      active: true,
    });
    return product;
  } catch (error) {
    return error;
  }
}

export const getStripeProductService = async (productId: string) => {
  try {
    const product = await stripeInstance.products.retrieve(productId);
    return product;
  } catch (error) {
    return error;
  }
}

export const getAllStripeProductsService = async () => {
  try {
    const products = await stripeInstance.products.list({
      limit: 20,
    });
    return products;
  } catch (error) {
    return error;
  }
}

export const updateStripeProductService = async (productId: string, updates: any) => {
  try {
    const product = await stripeInstance.products.update(productId, {
      ...updates
    });
    return product;
  } catch (error) {
    return error;
  }
}

export const deleteStripeProductService = async (productId: string) => {
  try {
    const product = await stripeInstance.products.del(productId);
    return product;
  } catch (error) {
    return error;
  }
}

////// Stripe Prices and Operations //////

export const createStripePriceService = async (priceData: any) => {
  try {
    const price = await stripeInstance.prices.create({
      product: priceData.productId,
      unit_amount: priceData.unitAmount,
      currency: priceData.currency || 'usd',
      recurring: {
        interval: priceData.interval || 'month',
      },
    });
    return price;
  } catch (error) {
    return error;
  }
}

export const getStripePriceService = async (priceId: string) => {
  try {
    const price = await stripeInstance.prices.retrieve(priceId);
    return price;
  } catch (error) {
    return error;
  }
}

export const getAllStripePricesService = async () => {
  try {
    const prices = await stripeInstance.prices.list({
      limit: 30,
    });
    return prices;
  } catch (error) {
    return error;
  }
}

export const updateStripePriceService = async (priceId: string, updates: any) => {
  try {
    const price = await stripeInstance.prices.update(priceId, {
      ...updates
    });
    return price;
  } catch (error) {
    return error;
  }
}

////// Stripe Subscriptions and Operations //////

export const createStripeSubscriptionService = async (subscriptionData: any) => {
  try {
    const subscription = await stripeInstance.subscriptions.create({
      customer: subscriptionData.customerId,
      items: [{
        price: subscriptionData.priceId,
        quantity: subscriptionData.quantity || 1,

      }]
    });
    return subscription;
  } catch (error) {
    return error;
  }
}

export const getStripeSubscriptionService = async (subscriptionId: string) => {
  try {
    const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    return error;
  }
}

export const getStripeSubscriptionByCustomerService = async (customerId: string) => {
  try {
    const subscription = await stripeInstance.subscriptions.list({
      customer: customerId,
      limit: 10
    });
    return subscription;
  } catch (error) {
    return error;
  }
}

export const updateStripeSubscriptionService = async (subscriptionId: string, updates: any) => {
  try {
    const subscription = await stripeInstance.subscriptions.update(subscriptionId, {
      ...updates,

    });
    return subscription;
  } catch (error) {
    return error;
  }
}

export const cancelStripeSubscriptionService = async (subscriptionId: string) => {
  try {
    const subscription = await stripeInstance.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    return error;
  }
}

////// Stripe Connect Accounts and Operations //////

export const createStripeConnectAccountService = async (email: string) => {
  try {
    const account = await stripeInstance.accounts.create({
      type: 'standard',
      country: 'US',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
        card_issuing: { requested: true }
      },

    });
    return account;
  } catch (error) {
    return error;
  }
}

export const createStripeConnectAccountLinkService = async (accountId: string) => {
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


////// Stripe Issuing Cards and Operations //////
export const createStripeIssuingCardHolderService = async (customerId: string, connectedAccountId: string, additionalCardHolderData: any) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.create({
      type: 'individual',
      customer: customerId,
      ...additionalCardHolderData
    },
      {
        stripeAccount: connectedAccountId
      }
    );
    return cardHolder;
  } catch (error) {
    return error;
  }
}

export const getStripeIssuingCardHolderService = async (cardHolderId: string) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.retrieve(cardHolderId);
    return cardHolder;
  } catch (error) {
    return error;
  }
}

export const updateStripeIssuingCardHolderService = async (cardHolderId: string, connectedAccountId: string, updates: any) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.update(cardHolderId, {
      ...updates
    },
      {
        stripeAccount: connectedAccountId
      }
    );
    return cardHolder;
  } catch (error) {
    return error;
  }
}

export const createStripeIssuingCardService = async (cardHolderId: string, connectedAccountId: string, additionalCardData: any) => {
  try {
    const card = await stripeInstance.issuing.cards.create({
      cardholder: cardHolderId,
      currency: 'usd',
      type: 'virtual',
      ...additionalCardData
    },
      {
        stripeAccount: connectedAccountId
      }
    );
    return card;
  } catch (error) {
    return error;
  }
}

export const getStripeIssuingCardService = async (cardId: string) => {
  try {
    const card = await stripeInstance.issuing.cards.retrieve(cardId);
    return card;
  } catch (error) {
    return error;
  }
}

export const updateStripeIssuingCardService = async (cardId: string, connectedAccountId: string, updates: any) => {
  try {
    const card = await stripeInstance.issuing.cards.update(cardId, {
      ...updates
    },
      {
        stripeAccount: connectedAccountId
      }
    );
    return card;
  } catch (error) {
    return error;
  }
}