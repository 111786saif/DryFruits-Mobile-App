import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const cartService = {
  getCart: async () => {
    return await apiClient.get(ENDPOINTS.CART.GET);
  },

  addItem: async (productId, quantity, variantId) => {
    return await apiClient.post(ENDPOINTS.CART.ADD_ITEM, {
      product_id: productId,
      quantity,
      variant_id: variantId,
    });
  },

  updateItem: async (itemId, quantity) => {
    return await apiClient.put(ENDPOINTS.CART.UPDATE_ITEM(itemId), { quantity });
  },

  removeItem: async (itemId) => {
    return await apiClient.delete(ENDPOINTS.CART.DELETE_ITEM(itemId));
  },
};

export default cartService;
