import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryState } from '@/types/categories';
import { getCategories } from '@/redux/actions/categories';

const initialState: CategoryState = {
    categories: [],
    loading: 'idle',
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategories: (state) => {
            state.categories = [];
            state.error = null;
            state.loading = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = 'succeeded';
                const data = action.payload;
                console.log("🚀 ~ data:", data)
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message ?? 'Failed to fetch categories';
            })
    }
});


export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;