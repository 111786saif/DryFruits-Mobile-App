import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

const promocodeService = {
  validate: async (code, amount) => {
    return await apiClient.post(ENDPOINTS.PROMOCODE.VALIDATE, {
      code,
      amount,
    });
  },
};

export default promocodeService;
