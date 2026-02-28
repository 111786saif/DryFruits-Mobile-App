import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../api/services/cartService';
import { getGuestUuid } from '../../utils/cartUtils';

// Helper to extract cart data from various response formats
const extractCartData = (response) => {
  // Handle: { data: { items, totals } } or { items, totals } or { cart: { items, totals } }
  const cart = response?.data?.cart || response?.cart || response?.data || response;
  return {
    items: cart?.items || [],
    totals: cart?.totals || { subtotal: 0, formatted_subtotal: '$0.00' },
  };
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const guestUuid = await getGuestUuid();
    const response = await cartService.getCart(guestUuid);
    return extractCartData(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity, variantId }, { dispatch, rejectWithValue }) => {
  try {
    const guestUuid = await getGuestUuid();
    const response = await cartService.addItem(productId, quantity, variantId, guestUuid);
    // Re-fetch the full cart to ensure we have the latest data
    dispatch(fetchCart());
    return extractCartData(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to add item to cart');
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const guestUuid = await getGuestUuid();
    const response = await cartService.updateItem(itemId, quantity, guestUuid);
    return extractCartData(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to update quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const guestUuid = await getGuestUuid();
    const response = await cartService.deleteItem(itemId, guestUuid);
    return extractCartData(response);
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
    totals: {
      subtotal: 0,
      formatted_subtotal: '$0.00'
    },
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totals = { subtotal: 0, formatted_subtotal: '$0.00' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totals = action.payload.totals || { subtotal: 0, formatted_subtotal: '$0.00' };
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || state.items;
        state.totals = action.payload.totals || state.totals;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Explicitly handle updateQuantity for real-time feedback
      .addCase(updateQuantity.pending, (state, action) => {
        // Optimistic update: find the item and update its quantity immediately in the UI
        const { itemId, quantity } = action.meta.arg;
        const item = state.items.find(i => i.id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
        state.totals = action.payload.totals || state.totals;
      })
      // Optimistic removal for real-time feedback
      .addCase(removeFromCart.pending, (state, action) => {
        const itemId = action.meta.arg;
        state.items = state.items.filter(item => item.id !== itemId);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
        state.totals = action.payload.totals || state.totals;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
