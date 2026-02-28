import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../api/services/orderService';

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await orderService.getOrders();
    return response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch orders');
  }
});

export const fetchOrderDetails = createAsyncThunk('orders/fetchDetails', async (orderId, { rejectWithValue }) => {
  try {
    const response = await orderService.getOrderDetails(orderId);
    return response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch order details');
  }
});

export const checkout = createAsyncThunk('orders/checkout', async (checkoutData, { rejectWithValue }) => {
  try {
    const response = await orderService.checkout(checkoutData);
    return response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Checkout failed');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    loading: false,
    checkoutLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(checkout.pending, (state) => {
        state.checkoutLoading = true;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.checkoutLoading = false;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
