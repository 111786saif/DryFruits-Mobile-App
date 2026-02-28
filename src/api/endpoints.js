// Toggle this to true if you are running the backend locally on port 8000
// Toggle this to false to use the production API
const USE_LOCAL_API = false; 

const DEV_URL = 'http://10.0.2.2:8000/api/v1';
const PROD_URL = 'https://violet-mosquito-961599.hostingersite.com/api/v1';

export const BASE_URL = USE_LOCAL_API ? DEV_URL : PROD_URL;




export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    ADDRESSES: '/auth/addresses',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
    RELATED: (id) => `/products/${id}/related`,
    TOP: '/products/top',
    SPECIAL_OFFERS: '/products/special-offers',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAILS: (id) => `/categories/${id}`,
  },
  BRANDS: {
    LIST: '/brands',
    DETAILS: (id) => `/brands/${id}`,
  },
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
    DELETE_ITEM: (itemId) => `/cart/items/${itemId}`,
  },
  ORDERS: {
    LIST: '/orders',
    DETAILS: (orderId) => `/orders/${orderId}`,
    CHECKOUT: '/checkout',
  },
  WISHLIST: {
    GET: '/wishlist',
    ADD_ITEM: '/wishlist/items',
    DELETE_ITEM: (itemId) => `/wishlist/items/${itemId}`,
  },
  PROMOCODE: {
    VALIDATE: '/promocode/validate',
  },
  HEALTH: '/health',
};
