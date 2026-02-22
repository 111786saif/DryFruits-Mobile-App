import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const cartService = {
  getCart: async (guestUuid) => {
    return await apiClient.get(ENDPOINTS.CART.GET, {
      params: { guest_uuid: guestUuid }
    });
  },

  addItem: async (productId, quantity, variantId, guestUuid) => {
    return await apiClient.post(ENDPOINTS.CART.ADD_ITEM, {
      product_id: productId,
      quantity,
      variant_id: variantId,
      guest_uuid: guestUuid,
    });
  },

  updateItem: async (itemId, quantity, guestUuid) => {
    return await apiClient.put(ENDPOINTS.CART.UPDATE_ITEM(itemId), { 
      quantity,
      guest_uuid: guestUuid 
    });
  },

  deleteItem: async (itemId, guestUuid) => {
    return await apiClient.delete(ENDPOINTS.CART.DELETE_ITEM(itemId), {
      params: { guest_uuid: guestUuid }
    });
  },
};

export default cartService;
