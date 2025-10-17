import { Product } from '@/types/products';
import { apiCall } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Get all products with pagination and filtering
export const getProducts = createAsyncThunk(
    'products/getAll',
    async ({
        offset = 0,
        limit = 10,
        categoryId,
        token
    }: {
        offset?: number;
        limit?: number;
        categoryId?: string;
        token: string
    }, thunkAPI) => {
        try {
            const params = new URLSearchParams();
            params.append('offset', offset.toString());
            params.append('limit', limit.toString());
            if (categoryId) params.append('categoryId', categoryId);

            const response = await apiCall<Product[]>(`/products?${params}`, "GET", undefined, token);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
);

// Create a new product
export const createProduct = createAsyncThunk(
    'products/create',
    async ({
        productsData,
        token
    }: {
        productsData: Omit<Product, 'id' | 'slug' | 'category'>;
        token: string
    }, thunkAPI) => {
        try {
            const response = await apiCall<Product>("/products", "POST", productsData, token);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to create product');
        }
    }
);

// Search products by name
export const searchProducts = createAsyncThunk(
    'products/search',
    async ({
        query,
        token
    }: {
        query: string;
        token: string
    }, thunkAPI) => {
        try {
            const response = await apiCall<Product[]>(`/search?searchedText=${query}`, "GET", undefined, token);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Search failed');
        }
    }
);

// Get product by slug
export const getProductBySlug = createAsyncThunk(
    'products/getBySlug',
    async ({
        slug,
        token
    }: {
        slug: string;
        token: string
    }, thunkAPI) => {
        try {
            const response = await apiCall<Product>(`/products/${slug}`, "GET", undefined, token);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch product');
        }
    }
);

// Update product
export const updateProduct = createAsyncThunk(
    'products/update',
    async ({
        id,
        data,
        token
    }: {
        id: string;
        data: Partial<Product>;
        token: string
    }, thunkAPI) => {
        try {
            const response = await apiCall<Product>(`/products/${id}`, "PUT", data, token);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to update product');
        }
    }
);

// Delete product
export const deleteProduct = createAsyncThunk(
    'products/delete',
    async ({
        id,
        token
    }: {
        id: string;
        token: string
    }, thunkAPI) => {
        try {
            await apiCall(`/products/${id}`, "DELETE", undefined, token);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to delete product');
        }
    }
);