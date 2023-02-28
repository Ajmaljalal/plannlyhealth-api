import { Request, Response } from 'express';
import {
  attachPaymentMethodService,
  cancelStripeSubscriptionService,
  chargePaymentMethodService,
  createPaymentMethodService,
  createStripeCustomerService,
  createStripePriceService,
  createStripeProductService,
  createStripeSubscriptionService,
  deleteStripeProductService,
  detachPaymentMethodService,
  getAllStripePricesService,
  getAllStripeProductsService,
  getStripeCustomerService,
  getStripePriceService,
  getStripeProductService,
  getStripeSubscriptionByCustomerService,
  getStripeSubscriptionService,
  updateStripeCustomerService,
  updateStripePriceService,
  updateStripeProductService,
  updateStripeSubscriptionService,
} from '../services/stripe';

export const createCustomer = async (req: Request, res: Response) => {
  const customerData = req.body;
  // 1. check if customerData is not empty
  if (Object.keys(customerData).length === 0) {
    return res.status(400).json({
      message: 'Cannot create empty customer',
      code: 'CUSTOMER_DATA_REQUIRED'
    });
  }
  try {
    // 2. create customer
    const customer: any = await createStripeCustomerService(customerData);
    if (customer.statusCode) {
      return res.status(customer.statusCode).json({
        message: customer.message,
        code: customer.code
      })
    }
    // 3. return customer
    return res.status(201).json(customer);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  // 1. check if customerId is not empty
  if (!customerId) {
    return res.status(400).json({
      message: 'Cannot get customer, customerId is required',
      code: 'BAD_REQUEST'
    });
  }
  try {
    // 2. get customer
    const customer: any = await getStripeCustomerService(customerId);
    if (customer.statusCode) {
      return res.status(customer.statusCode).json({
        message: customer.message,
        code: customer.code
      })
    }
    // 3. return customer
    return res.status(200).json(customer);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const createPaymentMethod = async (req: Request, res: Response) => {
  const paymentMethodData = req.body;


  // 1. check if paymentMethodData is not empty
  if (Object.keys(paymentMethodData).length === 0) {
    return res.status(400).json({
      message: 'Cannot create empty payment method',
      code: 'PAYMENT_METHOD_DATA_REQUIRED'
    });
  }

  // 2. check if paymentMethodData has customerId
  if (!paymentMethodData.customerId) {
    return res.status(400).json({
      message: 'Cannot create payment method, customerId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. create payment method
    const paymentMethod: any = await createPaymentMethodService(paymentMethodData);
    if (paymentMethod.statusCode) {
      return res.status(paymentMethod.statusCode).json({
        message: paymentMethod.message,
        code: paymentMethod.code
      })
    }
    // 3. attach payment method to customer
    const customer: any = await attachPaymentMethodService(paymentMethodData.customerId, paymentMethod.id);
    if (customer.statusCode) {
      return res.status(customer.statusCode).json({
        message: customer.message,
        code: 'BAD_REQUEST'
      })
    }
    // 4. update customer with payment method id
    const updatedCustomer: any = await updateStripeCustomerService(paymentMethodData.customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }
    });
    if (updatedCustomer.statusCode) {
      return res.status(updatedCustomer.statusCode).json({
        message: updatedCustomer.message,
        code: 'BAD_REQUEST'
      })
    }
    // 5. return payment method
    return res.status(201).json(paymentMethod);
  }
  // 6. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const attachPaymentMethodToCustomer = async (req: Request, res: Response) => {
  const { customerId, paymentMethodId } = req.body;

  // 1. check if customerId and paymentMethodId are not empty
  if (!customerId || !paymentMethodId) {
    return res.status(400).json({
      message: 'Cannot attach payment method to customer, customerId and paymentMethodId are required',
      code: 'BAD_REQUEST'
    });
  }
  try {
    // 2. attach payment method to customer
    const customer: any = await attachPaymentMethodService(customerId, paymentMethodId);
    if (customer.statusCode) {
      return res.status(customer.statusCode).json({
        message: customer.message,
        code: 'BAD_REQUEST'
      })
    }
    // 3. return customer
    return res.status(201).json(customer);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const setCustomerDefaultPaymentMethod = async (req: Request, res: Response) => {
  const { customerId, paymentMethodId } = req.body;

  // 1. check if customerId and paymentMethodId are not empty
  if (!customerId || !paymentMethodId) {
    return res.status(400).json({
      message: 'Cannot update customer payment method, customerId and paymentMethodId are required',
      code: 'BAD_REQUEST'
    });
  }
  try {
    // 2. update customer payment method
    const customer: any = await updateStripeCustomerService(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    if (customer.statusCode) {
      return res.status(customer.statusCode).json({
        message: customer.message,
        code: 'BAD_REQUEST'
      })
    }
    // 3. return customer
    return res.status(201).json(customer);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const detachPaymentMethodFromCustomer = async (req: Request, res: Response) => {
  const { paymentMethodId } = req.body;

  // 1. check if paymentMethodId are not empty
  if (!paymentMethodId) {
    return res.status(400).json({
      message: 'Cannot detach payment method from customer, paymentMethodId is required',
      code: 'BAD_REQUEST'
    });
  }
  try {
    // 2. detach payment method from customer
    const customer: any = await detachPaymentMethodService(paymentMethodId);
    if (customer.statusCode) {
      return res.status(customer.statusCode).json({
        message: customer.message,
        code: 'BAD_REQUEST'
      })
    }
    // 3. return customer
    return res.status(201).json(customer);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const chargePaymentMethod = async (req: Request, res: Response) => {
  const paymentData = req.body;

  // 1. check if paymentData is not empty
  if (Object.keys(paymentData).length === 0) {
    return res.status(400).json({
      message: 'Cannot create empty payment',
      code: 'PAYMENT_DATA_REQUIRED'
    });
  }

  try {
    // 2. create payment intent
    const paymentIntent: any = await chargePaymentMethodService(paymentData);
    if (paymentIntent.statusCode) {
      return res.status(paymentIntent.statusCode).json({
        message: paymentIntent.message,
        code: paymentIntent.code
      })
    }
    // 3. return payment intent
    return res.status(201).json(paymentIntent);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const productData = req.body;

  // 1. check if productData is not empty
  if (Object.keys(productData).length === 0) {
    return res.status(400).json({
      message: 'Cannot create empty product',
      code: 'PRODUCT_DATA_REQUIRED'
    });
  }

  try {
    // 2. create product
    const product: any = await createStripeProductService(productData);
    if (product.statusCode) {
      return res.status(product.statusCode).json({
        message: product.message,
        code: product.code
      })
    }
    // 3. return product
    return res.status(201).json(product);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;

  // 1. check if productId is not empty
  if (!productId) {
    return res.status(400).json({
      message: 'Cannot get product, productId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. get product
    const product: any = await getStripeProductService(productId);
    if (product.statusCode) {
      return res.status(product.statusCode).json({
        message: product.message,
        code: product.code
      })
    }
    // 3. return product
    return res.status(201).json(product);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // 1. get all products
    const products: any = await getAllStripeProductsService();
    if (products.statusCode) {
      return res.status(products.statusCode).json({
        message: products.message,
        code: products.code
      })
    }
    // 2. return products
    return res.status(201).json(products.data);
  }
  // 3. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const productData = req.body;

  // 1. check if productId and productData are not empty
  if (!productId || Object.keys(productData).length === 0) {
    return res.status(400).json({
      message: 'Cannot update product, productId and productData are required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. update product
    const product: any = await updateStripeProductService(productId, productData);
    if (product.statusCode) {
      return res.status(product.statusCode).json({
        message: product.message,
        code: product.code
      })
    }
    // 3. return product
    return res.status(201).json(product);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;

  // 1. check if productId is not empty
  if (!productId) {
    return res.status(400).json({
      message: 'Cannot delete product, productId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. delete product
    const product: any = await deleteStripeProductService(productId);
    if (product.statusCode) {
      return res.status(product.statusCode).json({
        message: product.message,
        code: product.code
      })
    }
    // 3. return product
    return res.status(201).json(product);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const createPrice = async (req: Request, res: Response) => {
  const priceData = req.body;

  // 1. check if priceData is not empty
  if (Object.keys(priceData).length === 0) {
    return res.status(400).json({
      message: 'Cannot create empty price',
      code: 'PRICE_DATA_REQUIRED'
    });
  }

  try {
    // 2. create price
    const price: any = await createStripePriceService(priceData);
    if (price.statusCode) {
      return res.status(price.statusCode).json({
        message: price.message,
        code: price.code
      })
    }
    // 3. return price
    return res.status(201).json(price);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getPriceById = async (req: Request, res: Response) => {
  const { priceId } = req.params;

  // 1. check if priceId is not empty
  if (!priceId) {
    return res.status(400).json({
      message: 'Cannot get price, priceId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. get price
    const price: any = await getStripePriceService(priceId);
    if (price.statusCode) {
      return res.status(price.statusCode).json({
        message: price.message,
        code: price.code
      })
    }
    // 3. return price
    return res.status(201).json(price);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getAllPrices = async (req: Request, res: Response) => {
  try {
    // 1. get all prices
    const prices: any = await getAllStripePricesService();
    if (prices.statusCode) {
      return res.status(prices.statusCode).json({
        message: prices.message,
        code: prices.code
      })
    }
    // 2. return prices
    return res.status(201).json(prices.data);
  }
  // 3. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const updatePrice = async (req: Request, res: Response) => {
  const { priceId } = req.params;
  const priceData = req.body;

  // 1. check if priceId and priceData are not empty
  if (!priceId || Object.keys(priceData).length === 0) {
    return res.status(400).json({
      message: 'Cannot update price, priceId and priceData are required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. update price
    const price: any = await updateStripePriceService(priceId, priceData);
    if (price.statusCode) {
      return res.status(price.statusCode).json({
        message: price.message,
        code: price.code
      })
    }
    // 3. return price
    return res.status(201).json(price);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

// subscription controller
export const createSubscription = async (req: Request, res: Response) => {
  const subscriptionData = req.body;

  // 1. check if subscriptionData is not empty
  if (Object.keys(subscriptionData).length === 0) {
    return res.status(400).json({
      message: 'Cannot create empty subscription',
      code: 'SUBSCRIPTION_DATA_REQUIRED'
    });
  }

  try {
    // 2. create subscription
    const subscription: any = await createStripeSubscriptionService(subscriptionData);
    if (subscription.statusCode) {
      return res.status(subscription.statusCode).json({
        message: subscription.message,
        code: subscription.code
      })
    }
    // 3. return subscription
    return res.status(201).json(subscription);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getSubscriptionById = async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;

  // 1. check if subscriptionId is not empty
  if (!subscriptionId) {
    return res.status(400).json({
      message: 'Cannot get subscription, subscriptionId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. get subscription
    const subscription: any = await getStripeSubscriptionService(subscriptionId);
    if (subscription.statusCode) {
      return res.status(subscription.statusCode).json({
        message: subscription.message,
        code: subscription.code
      })
    }
    // 3. return subscription
    return res.status(201).json(subscription);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const getSubscriptionByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  // 1. check if customerId is not empty
  if (!customerId) {
    return res.status(400).json({
      message: 'Cannot get subscription, customerId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. get subscription
    const subscription: any = await getStripeSubscriptionByCustomerService(customerId);
    if (subscription.statusCode) {
      return res.status(subscription.statusCode).json({
        message: subscription.message,
        code: subscription.code
      })
    }
    // 3. return subscription
    return res.status(201).json(subscription.data);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const updateSubscription = async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;
  const subscriptionData = req.body;

  // 1. check if subscriptionId and subscriptionData are not empty
  if (!subscriptionId || Object.keys(subscriptionData).length === 0) {
    return res.status(400).json({
      message: 'Cannot update subscription, subscriptionId and subscriptionData are required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. update subscription
    const subscription: any = await updateStripeSubscriptionService(subscriptionId, subscriptionData);
    if (subscription.statusCode) {
      return res.status(subscription.statusCode).json({
        message: subscription.message,
        code: subscription.code
      })
    }
    // 3. return subscription
    return res.status(201).json(subscription);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}

export const cancelSubscription = async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;

  // 1. check if subscriptionId is not empty
  if (!subscriptionId) {
    return res.status(400).json({
      message: 'Cannot cancel subscription, subscriptionId is required',
      code: 'BAD_REQUEST'
    });
  }

  try {
    // 2. cancel subscription
    const subscription: any = await cancelStripeSubscriptionService(subscriptionId);
    if (subscription.statusCode) {
      return res.status(subscription.statusCode).json({
        message: subscription.message,
        code: subscription.code
      })
    }
    // 3. return subscription
    return res.status(201).json(subscription);
  }
  // 4. catch error
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}