import { Product } from '@/types/products';
import { apiCall } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllProducts = createAsyncThunk(
    'products/getAll',
    async ({ productsData, token }: { productsData: Product | Product[]; token: string }, { rejectWithValue }) => {
        try {
            const response = await apiCall("/products", "POST", productsData, token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)