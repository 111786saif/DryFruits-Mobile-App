import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const wishlistService = {
  getWishlist: async (guestUuid) => {
    return await apiClient.get(ENDPOINTS.WISHLIST.GET, {
      params: { guest_uuid: guestUuid }
    });
  },

  addToWishlist: async (productId, variantId, guestUuid) => {
    return await apiClient.post(ENDPOINTS.WISHLIST.ADD_ITEM, { 
      product_id: productId,
      variant_id: variantId,
      guest_uuid: guestUuid
    });
  },

  removeFromWishlist: async (wishlistItemId, guestUuid) => {
    return await apiClient.delete(ENDPOINTS.WISHLIST.DELETE_ITEM(wishlistItemId), {
      params: { guest_uuid: guestUuid }
    });
  },
};

export default wishlistService;
