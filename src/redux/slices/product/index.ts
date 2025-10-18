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
                state.products = action.payload;
                
                // Better total count estimation logic
                const receivedCount = action.payload.length;
                
                if (receivedCount < state.limit) {
                    // Last page - we know exact total
                    state.total = ((state.currentPage - 1) * state.limit) + receivedCount;
                } else {
                    // Full page received - there might be more pages
                    // Set total to show at least one more page
                    state.total = (state.currentPage * state.limit) + 1;
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
                // For search, total is just the result count
                state.total = action.payload.length;
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
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createLoading = 'succeeded';
                // Don't add to products array if we're not on page 1
                // Better to refresh the list
                if (state.currentPage === 1) {
                    state.products.unshift(action.payload);
                    // If we exceed limit, remove last item
                    if (state.products.length > state.limit) {
                        state.products.pop();
                    }
                }
                state.total += 1;
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
                state.total = Math.max(0, state.total - 1);
            });
    }
});

export const { setSearchQuery, setCurrentPage, clearSearchResults } = productsSlice.actions;
export default productsSlice.reducer;