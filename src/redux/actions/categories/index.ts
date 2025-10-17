import { apiCall } from '@/services/api';
import { Category } from '@/types/categories';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface GetCategoriesParams {
    token: string;
}

export const getCategories = createAsyncThunk(
    'categories/getAll',
    async (params: GetCategoriesParams, thunkAPI): Promise<Category[]> => {
        try {
            const { token } = params;
            
            const categories = await apiCall<Category[]>(
                `/categories`, 
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