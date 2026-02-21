import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const wishlistService = {
  getWishlist: async () => {
    return await apiClient.get(ENDPOINTS.WISHLIST.GET);
  },

  addToWishlist: async (productId) => {
    return await apiClient.post(ENDPOINTS.WISHLIST.ADD, { product_id: productId });
  },

  removeFromWishlist: async (productId) => {
    return await apiClient.delete(ENDPOINTS.WISHLIST.REMOVE(productId));
  },
};

export default wishlistService;
