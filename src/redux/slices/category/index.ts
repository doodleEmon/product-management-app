import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryState } from '@/types/categories';
import { getCategories } from '@/redux/actions/categories';

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategories: (state) => {
            state.categories = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = false;
                const data = action.payload;
                console.log("🚀 ~ data:", data)
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch categories';
            })
    }
});


export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;