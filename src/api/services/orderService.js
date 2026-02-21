import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const orderService = {
  getOrders: async () => {
    return await apiClient.get(ENDPOINTS.ORDERS.LIST);
  },

  getOrderDetails: async (orderId) => {
    return await apiClient.get(ENDPOINTS.ORDERS.DETAILS(orderId));
  },

  checkout: async (checkoutData) => {
    return await apiClient.post(ENDPOINTS.ORDERS.CHECKOUT, checkoutData);
  },
};

export default orderService;
