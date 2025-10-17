import { apiCall } from '@/services/api';
import { Category } from '@/types/categories';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface GetCategoriesParams {
    offset?: number;
    limit?: number;
    token: string;
}

export const getCategories = createAsyncThunk(
    'categories/getAll',
    async (params: GetCategoriesParams, thunkAPI): Promise<Category[]> => {
        try {
            const { offset = 0, limit = 100, token } = params;
            const queryParams = new URLSearchParams({
                offset: offset.toString(),
                limit: limit.toString()
            });
            
            const categories = await apiCall<Category[]>(
                `/categories?${queryParams}`, 
                'GET', 
                undefined, 
                token
            );
            
            return categories;
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to fetch categories';
            return thunkAPI.rejectWithValue(errorMessage) as any;
        }
    }
);