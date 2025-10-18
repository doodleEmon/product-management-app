import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, searchProducts } from '@/redux/actions/products';
import { ProductState } from '@/types/products';

const initialState: ProductState = {
    products: [],
    product: null,
    loading: 'idle',
    searchLoading: 'idle',
    createLoading: 'idle',
    updateLoading: 'idle',
    slugLoading: 'idle',
    error: null,
    searchError: null,
    createError: null,
    updateError: null,
    slugError: null,
    searchQuery: '',
    currentPage: 1,
    total: 0,
    limit: 12,
    hasMore: true,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearSearchResults: (state) => {
            state.searchQuery = '';
            state.products = [];
            state.searchError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // get all products
            .addCase(getProducts.pending, (state) => { 
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.products = action.payload.products;
                state.hasMore = action.payload.hasMore;
                
                // Calculate total based on hasMore flag
                const currentOffset = action.payload.offset;
                const currentLimit = action.payload.limit;
                const receivedCount = action.payload.products.length;
                
                if (action.payload.hasMore) {
                    // If there are more items, total is at least current offset + limit + 1
                    state.total = currentOffset + currentLimit + 1;
                } else {
                    // No more items, so total is exact
                    state.total = currentOffset + receivedCount;
                }
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message ?? 'Failed to fetch products';
            })

            // get searched products
            .addCase(searchProducts.pending, (state) => {
                state.searchLoading = 'pending';
                state.searchError = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.searchLoading = 'succeeded';
                state.products = action.payload;
                state.total = action.payload.length;
                state.hasMore = false;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.searchLoading = 'failed';
                state.searchError = action.error.message ?? 'Search failed';
            })

            // get product by slug
            .addCase(getProductBySlug.pending, (state) => {
                state.slugLoading = 'pending';
                state.slugError = null;
            })
            .addCase(getProductBySlug.fulfilled, (state, action) => {
                state.slugLoading = 'succeeded';
                state.product = action.payload;
            })
            .addCase(getProductBySlug.rejected, (state, action) => {
                state.slugLoading = 'failed';
                state.slugError = action.error.message ?? 'Failed to fetch product';
            })

            // create product
            .addCase(createProduct.pending, (state) => {
                state.createLoading = 'pending';
                state.createError = null;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.createLoading = 'succeeded';
                // Don't modify products array - just refresh will handle it
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createLoading = 'failed';
                state.createError = action.error.message ?? 'Failed to create product';
            })

            // update product
            .addCase(updateProduct.pending, (state) => {
                state.updateLoading = 'pending';
                state.updateError = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateLoading = 'succeeded';
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateLoading = 'failed';
                state.updateError = action.error.message ?? 'Failed to update product';
            })

            // delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p.id !== action.payload);
            });
    }
});

export const { setSearchQuery, setCurrentPage, clearSearchResults } = productsSlice.actions;
export default productsSlice.reducer;