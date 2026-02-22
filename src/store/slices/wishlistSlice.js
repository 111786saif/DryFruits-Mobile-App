import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../api/services/wishlistService';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await wishlistService.getWishlist();
    // Support various API response formats: 
    // 1. Array directly: [...]
    // 2. { data: [...] }
    // 3. { items: [...] }
    // 4. { data: { items: [...] } }
    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.items && Array.isArray(response.items)) return response.items;
    if (response.data?.items && Array.isArray(response.data.items)) return response.data.items;
    
    return [];
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product, { getState, rejectWithValue }) => {
  const { items } = getState().wishlist;
  const productId = String(product.id);
  
  // Robust check for existing item
  const existingItem = items.find(item => 
    String(item.product?.id || item.id) === productId
  );
  
  try {
    if (existingItem) {
      if (String(existingItem.id).startsWith('temp-')) {
        return { productId: product.id, action: 'removed', wasOptimistic: true };
      }
      
      await wishlistService.removeFromWishlist(existingItem.id);
      return { productId: product.id, action: 'removed' };
    } else {
      const variantId = product.variants?.[0]?.id || product.default_variant_id || product.id;
      const response = await wishlistService.addToWishlist(product.id, variantId);
      
      // Extract the new wishlist item robustly
      let newItem = response.data || response;
      if (newItem.items && Array.isArray(newItem.items)) {
        newItem = newItem.items[0];
      } else if (Array.isArray(newItem)) {
        newItem = newItem[0];
      }
      
      return { item: newItem, action: 'added' };
    }
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to update wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
    pendingIds: [], // Track which products are currently being toggled
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.pending, (state, action) => {
        const product = action.meta.arg;
        const productId = String(product.id);
        
        state.pendingIds.push(productId);
        
        const index = state.items.findIndex(item => 
          String(item.product?.id || item.id) === productId
        );
        
        if (index >= 0) {
          // Optimistic remove
          state.items.splice(index, 1);
        } else {
          // Optimistic add (with temporary ID)
          state.items.push({ 
            id: `temp-${Date.now()}`, 
            product: product,
            isOptimistic: true 
          });
        }
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const product = action.meta.arg;
        const productId = String(product.id);
        
        state.pendingIds = state.pendingIds.filter(id => id !== productId);

        if (action.payload.action === 'added') {
          const newItem = action.payload.item;
          
          // First remove any existing item (optimistic or duplicate) for this product
          state.items = state.items.filter(item => 
            String(item.product?.id || item.id) !== productId
          );
          
          // Only re-add if the item still has the product data (to avoid adding empty objects)
          // and if we haven't just removed it optimistically in another call (not tracked yet)
          if (newItem) {
            state.items.push(newItem);
          }
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        const product = action.meta.arg;
        const productId = String(product.id);
        
        state.pendingIds = state.pendingIds.filter(id => id !== productId);
        state.error = action.payload;
        
        // On rejection, we should refetch to ensure UI is in sync with server
        // (Simple approach for rollback)
      });
  },
});

export default wishlistSlice.reducer;
