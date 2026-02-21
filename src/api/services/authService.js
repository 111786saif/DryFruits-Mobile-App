import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const authService = {
  login: async (credentials) => {
    return await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData) => {
    return await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
  },

  getProfile: async () => {
    return await apiClient.get(ENDPOINTS.AUTH.PROFILE);
  },

  updateProfile: async (profileData) => {
    return await apiClient.post(ENDPOINTS.AUTH.PROFILE, profileData);
  },

  getAddresses: async () => {
    return await apiClient.get(ENDPOINTS.AUTH.ADDRESSES);
  },

  addAddress: async (addressData) => {
    return await apiClient.post(ENDPOINTS.AUTH.ADDRESSES, addressData);
  },

  updateAddress: async (id, addressData) => {
    return await apiClient.put(`${ENDPOINTS.AUTH.ADDRESSES}/${id}`, addressData);
  },

  deleteAddress: async (id) => {
    return await apiClient.delete(`${ENDPOINTS.AUTH.ADDRESSES}/${id}`);
  },
};

export default authService;
