import { apiCall } from '@/services/api';
import { Category } from '@/types/categories';
import { getErrorMessage } from '@/utils/errorHandler';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface GetCategoriesParams {
    token: string;
}

export const getCategories = createAsyncThunk(
    'categories/getAll',
    async (params: GetCategoriesParams, { rejectWithValue }) => {
        try {
            const { token } = params;

            const categories = await apiCall<Category[]>(
                `/categories`,
                'GET',
                undefined,
                token
            );

            return categories;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);