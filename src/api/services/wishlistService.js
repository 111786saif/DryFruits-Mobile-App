import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const wishlistService = {
  getWishlist: async () => {
    return await apiClient.get(ENDPOINTS.WISHLIST.GET);
  },

  addToWishlist: async (productId, variantId) => {
    // Some backends use /wishlist and some use /wishlist/items
    // Based on the 404 error log, it was trying /wishlist/items/temp-...
    // So the endpoint exists but the ID was wrong.
    return await apiClient.post('/wishlist/items', { 
      product_id: productId,
      variant_id: variantId 
    });
  },

  removeFromWishlist: async (wishlistItemId) => {
    return await apiClient.delete(`/wishlist/items/${wishlistItemId}`);
  },
};

export default wishlistService;
