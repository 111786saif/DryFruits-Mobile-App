import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/services/authService';

export const fetchAddresses = createAsyncThunk('addresses/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getAddresses();
    return response.data;
  } catch (error) {
    return rejectWithValue(error || 'Failed to fetch addresses');
  }
});

export const addAddress = createAsyncThunk('addresses/add', async (addressData, { rejectWithValue }) => {
  try {
    const response = await authService.addAddress(addressData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error || 'Failed to add address');
  }
});

export const removeAddress = createAsyncThunk('addresses/remove', async (id, { rejectWithValue }) => {
  try {
    await authService.deleteAddress(id);
    return id;
  } catch (error) {
    return rejectWithValue(error || 'Failed to delete address');
  }
});

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default addressSlice.reducer;
