import stripe from "../configs/stripe";
import { AccountDataType, TransferDataType } from "../lib/types/stripe";

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

export const createStripeConnectAccountService = async (accountData: AccountDataType) => {
  try {
    const account = await stripeInstance.accounts.create({
      type: 'custom',
      country: 'US',
      business_type: 'company',
      email: accountData.email,
      // business_profile: {
      //   ...accountData.business_profile
      // },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
        card_issuing: { requested: true }
      },
      company: {
        ...accountData.company
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'manual',
          },
        },
        //   payments: {
        //     ...accountData.settings?.payments
        // }
      },
      // tos_acceptance: {
      //   date: Math.floor(Date.now() / 1000),
      //   ip: accountData.tos_acceptance.ip,
      // },
    });
    return account;

  } catch (error) {
    return error;
  }
}

export const getStripeConnectAccountService = async (accountId: string) => {
  try {
    const account = await stripeInstance.accounts.retrieve(accountId);
    return account;
  } catch (error) {
    return error;
  }
}

export const updateStripeConnectAccountService = async (accountId: string, updates: any) => {
  try {
    const account = await stripeInstance.accounts.update(accountId, {
      ...updates
    });
    return account;
  } catch (error) {
    return error;
  }
}

export const generateStripeConnectAccountLinkService = async (accountId: string) => {
  try {
    const accountLink = await stripeInstance.accountLinks.create({
      account: accountId,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });
    return accountLink;
  } catch (error) {
    return error;
  }
}

export const generateStripeConnectAccountUpdateLinkService = async (accountId: string) => {
  try {
    const accountLink = await stripeInstance.accountLinks.create({
      account: accountId,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_update',
    });
    return accountLink;
  } catch (error) {
    return error;
  }
}

export const transferFundsToConnectAccountService = async (transferData: TransferDataType) => {
  try {
    const transfer = await stripeInstance.transfers.create({
      amount: transferData.amount,
      currency: 'usd',
      destination: transferData.destinationConnectAccountId,
    });
    return transfer;
  } catch (error) {
    return error;
  }
}

////// Stripe Issuing Cardholders and Operations //////
export const createStripeIssuingCardHolderService = async (cardHolderData: any, connectedAccountId: string) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.create({
      type: 'individual',
      name: cardHolderData.name,
      email: cardHolderData.email,
      phone_number: cardHolderData.phone_number,
      status: 'active',
      billing: {
        address: {
          city: cardHolderData.city,
          country: cardHolderData.country,
          line1: cardHolderData.line1,
          line2: cardHolderData.line2,
          postal_code: cardHolderData.postal_code,
          state: cardHolderData.state,
        }
      }
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

export const getStripeIssuingCardHolderService = async (cardHolderId: string, connectedAccountId: string) => {
  try {
    const cardHolder = await stripeInstance.issuing.cardholders.retrieve(cardHolderId, {
      stripeAccount: connectedAccountId
    });
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


////// Stripe Issuing Cards and Operations //////
export const createStripeIssuingCardService = async (connectedAccountId: string, cardData: any) => {
  try {
    const card = await stripeInstance.issuing.cards.create({
      cardholder: cardData.cardholderId,
      currency: 'usd',
      type: 'virtual',
      ...cardData
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