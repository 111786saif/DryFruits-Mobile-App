import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const productService = {
  getProducts: async (params) => {
    return await apiClient.get(ENDPOINTS.PRODUCTS.LIST, { params });
  },

  getProductDetails: async (id) => {
    return await apiClient.get(ENDPOINTS.PRODUCTS.DETAILS(id));
  },

  getTopProducts: async () => {
    return await apiClient.get(ENDPOINTS.PRODUCTS.TOP);
  },

  getSpecialOffers: async () => {
    return await apiClient.get(ENDPOINTS.PRODUCTS.SPECIAL_OFFERS);
  },

  getCategories: async () => {
    return await apiClient.get(ENDPOINTS.CATEGORIES.LIST);
  },

  getCategoryDetails: async (id) => {
    return await apiClient.get(ENDPOINTS.CATEGORIES.DETAILS(id));
  },

  getBrands: async () => {
    return await apiClient.get(ENDPOINTS.BRANDS.LIST);
  },

  getBrandDetails: async (id) => {
    return await apiClient.get(ENDPOINTS.BRANDS.DETAILS(id));
  },
};

export default productService;
