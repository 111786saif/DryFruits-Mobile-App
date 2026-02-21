import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../api/services/cartService';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCart();
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity, variantId }, { rejectWithValue }) => {
  try {
    const response = await cartService.addItem(productId, quantity, variantId);
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to add item to cart');
  }
});

export const updateQuantity = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await cartService.updateItem(itemId, quantity);
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to update quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const response = await cartService.removeItem(itemId);
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to remove item');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    totalAmount: 0,
    discount: 0,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.shipping = action.payload.shipping;
        state.tax = action.payload.tax;
        state.totalAmount = action.payload.total;
        state.discount = action.payload.discount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => [addToCart.fulfilled, updateQuantity.fulfilled, removeFromCart.fulfilled].includes(action.type),
        (state, action) => {
          state.items = action.payload.items;
          state.subtotal = action.payload.subtotal;
          state.shipping = action.payload.shipping;
          state.tax = action.payload.tax;
          state.totalAmount = action.payload.total;
          state.discount = action.payload.discount;
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
