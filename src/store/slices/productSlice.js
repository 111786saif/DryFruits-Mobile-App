import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../api/services/productService';

// Helper to handle various API response structures (Laravel, standard REST, etc.)
const extractArray = (response) => {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.items && Array.isArray(response.items)) return response.items;
  return [];
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await productService.getProducts();
    return extractArray(response); 
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch products');
  }
});

export const fetchTopProducts = createAsyncThunk('products/fetchTop', async (_, { rejectWithValue }) => {
  try {
    const response = await productService.getTopProducts();
    return extractArray(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch top products');
  }
});

export const fetchRelatedProducts = createAsyncThunk('products/fetchRelated', async (productId, { rejectWithValue }) => {
  try {
    const response = await productService.getRelatedProducts(productId);
    return extractArray(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch related products');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await productService.getCategories();
    return extractArray(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch categories');
  }
});

export const fetchSpecialOffers = createAsyncThunk('products/fetchSpecialOffers', async (_, { rejectWithValue }) => {
  try {
    const response = await productService.getSpecialOffers();
    return extractArray(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to fetch special offers');
  }
});

export const searchProducts = createAsyncThunk('products/search', async (params, { rejectWithValue }) => {
  try {
    const response = await productService.getProducts(params);
    return extractArray(response);
  } catch (error) {
    return rejectWithValue(error.toString() || 'Failed to search products');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    topItems: [],
    specialOffers: [],
    searchResults: [],
    relatedItems: [],
    categories: [],
    loading: false,
    topLoading: false,
    specialOffersLoading: false,
    searchLoading: false,
    relatedLoading: false,
    categoriesLoading: false,
    error: null,
  },
  reducers: {
    clearRelated: (state) => {
      state.relatedItems = [];
    },
    clearSearch: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopProducts.pending, (state) => {
        state.topLoading = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topLoading = false;
        state.topItems = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedLoading = true;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.relatedItems = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedLoading = false;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSpecialOffers.pending, (state) => {
        state.specialOffersLoading = true;
      })
      .addCase(fetchSpecialOffers.fulfilled, (state, action) => {
        state.specialOffersLoading = false;
        state.specialOffers = action.payload;
      })
      .addCase(fetchSpecialOffers.rejected, (state, action) => {
        state.specialOffersLoading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRelated, clearSearch } = productSlice.actions;
export default productSlice.reducer;
