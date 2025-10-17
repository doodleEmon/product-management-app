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
    error: null,
    searchError: null,
    createError: null,
    updateError: null,
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
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message ?? 'Failed to fetch products';
            })

            // get searched products
            .addCase(searchProducts.pending, (state, action) => {
                state.searchLoading = 'pending';
                state.searchError = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.searchLoading = 'succeeded';
                state.products = action.payload;
            })

            // get product by slug
            .addCase(getProductBySlug.fulfilled, (state, action) => {
                state.product = action.payload;
            })

            // create product
            .addCase(createProduct.pending, (state, action) => {
                state.createLoading = 'pending';
                state.createError = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createLoading = 'succeeded';
                state.products.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createLoading = 'failed';
                state.createError = action.error.message ?? 'Failed to create product';
            })

            // update product
            .addCase(updateProduct.pending, (state, action) => {
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

export const { setSearchQuery, setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer;
