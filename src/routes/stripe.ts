import { Router } from 'express';
import {
  attachPaymentMethodToCustomer,
  cancelSubscription,
  chargePaymentMethod,
  createCard,
  createCardHolder,
  createConnectAccount,
  createCustomer,
  createPaymentMethod,
  createPrice,
  createProduct,
  createSubscription,
  deleteProduct,
  detachPaymentMethodFromCustomer,
  generateStripeConnectAccountLink,
  getAllPrices,
  getAllProducts,
  getCard,
  getCardHolder,
  getCustomer,
  getPriceById,
  getProductById,
  getSubscriptionByCustomerId,
  getSubscriptionById,
  setCustomerDefaultPaymentMethod,
  transferFundsToConnectAccount,
  updateCard,
  updateCardHolder,
  updatePrice,
  updateProduct,
  updateSubscription
} from '../controllers/stripe';


const router = Router();

// Customers and Payment Methods
router.post('/customers', createCustomer);
router.get('/customers/:customerId', getCustomer);
router.post('/customers/payment-methods', createPaymentMethod)
router.post('/customers/payment-methods/attach', attachPaymentMethodToCustomer)
router.post('/customers/payment-methods/detach', detachPaymentMethodFromCustomer)
router.put('/customers/payment-methods', setCustomerDefaultPaymentMethod)
router.post('/customers/payment-methods/charge', chargePaymentMethod)

// Products
router.post('/products', createProduct);
router.get('/products/:productId', getProductById);
router.get('/products', getAllProducts)
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

// prices
router.post('/prices', createPrice);
router.get('/prices/:priceId', getPriceById);
router.get('/prices', getAllPrices)
router.put('/prices/:priceId', updatePrice);


// subscriptions
router.post('/subscriptions', createSubscription);
router.get('/subscriptions/:subscriptionId', getSubscriptionById);
router.get('/subscriptions/customer/:customerId', getSubscriptionByCustomerId);
router.put('/subscriptions/:subscriptionId', updateSubscription);
router.get('/subscriptions/cancel/:subscriptionId', cancelSubscription);

// connect accounts
router.post('/accounts', createConnectAccount);
router.get('/accounts/onboarding/:accountId', generateStripeConnectAccountLink)
router.get('/accounts/update/:accountId', generateStripeConnectAccountLink)
router.post('/accounts/transfer', transferFundsToConnectAccount)

// issuing cardholders
router.post('/issuing/cardholders', createCardHolder);
router.get('/issuing/cardholders/:cardholderId/account/:connectedAccountId', getCardHolder);
router.put('/issuing/cardholders/:cardholderId', updateCardHolder)

// issuing cards
router.post('/issuing/cards', createCard);
router.get('/issuing/cards/:cardId/account/:connectedAccountId', getCard);
router.put('/issuing/cards/:cardId', updateCard)


export default router;
