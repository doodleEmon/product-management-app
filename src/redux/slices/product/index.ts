import { getAllProducts } from "@/redux/actions/products";
import { Product, ProductState } from "@/types/products"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: ProductState = {
    products: [],
    loading: 'idle',
    error: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.products = action.payload as Product[];
                state.error = null;
            })
        // .addCase(login.rejected, (state, action) => {
        //     state.authLoading = 'failed';
        //     state.authError = action.payload as string;
        // })
    },
})

export const { } = productSlice.actions;
export default productSlice.reducer; 