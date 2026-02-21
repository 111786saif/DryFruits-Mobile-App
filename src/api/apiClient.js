import axios from 'axios';
import { BASE_URL } from './endpoints';
import { getStorageItem, StorageKeys } from '../utils/storage';

const apiClient = axios.create({
  // Ensure no trailing slash to avoid double slashes with endpoints
  baseURL: BASE_URL.replace(/\/$/, ''),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'EverestMobileApp/1.0',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getStorageItem(StorageKeys.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Extract the most descriptive error message possible
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : null) ||
      error.message || 
      'Something went wrong';

    console.error('[API Error]:', {
      url: error.config?.url,
      status: error.response?.status,
      message: message,
      data: error.response?.data
    });

    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Logic to logout user or refresh token could go here
    }
    
    return Promise.reject(message);
  }
);

export default apiClient;
