import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../api/services/wishlistService';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await wishlistService.getWishlist();
    return response.data;
  } catch (error) {
    return rejectWithValue(error || 'Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product, { getState, rejectWithValue }) => {
  const { items } = getState().wishlist;
  const isWishlisted = items.some(item => item.product.id === product.id);
  
  try {
    if (isWishlisted) {
      await wishlistService.removeFromWishlist(product.id);
      return { productId: product.id, action: 'removed' };
    } else {
      await wishlistService.addToWishlist(product.id);
      return { product, action: 'added' };
    }
  } catch (error) {
    return rejectWithValue(error || 'Failed to update wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    await wishlistService.removeFromWishlist(productId);
    return productId;
  } catch (error) {
    return rejectWithValue(error || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.items = state.items.filter(item => item.product.id !== action.payload.productId);
        } else {
          state.items.push({ id: Date.now(), product: action.payload.product });
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
