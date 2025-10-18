import { Product, ProductFormData } from '@/types/products';
import { apiCall } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from '@/utils/errorHandler';

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
    }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('offset', offset.toString());
            params.append('limit', limit.toString());
            if (categoryId) params.append('categoryId', categoryId);

            const response = await apiCall<Product[]>(`/products?${params}`, "GET", undefined, token);

            // Return both products and metadata
            return {
                products: response,
                hasMore: response.length === limit,
                offset,
                limit
            };
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Failed to fetch products');
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
        productsData: ProductFormData;
        token: string
    }, { rejectWithValue }) => {
        try {
            const response = await apiCall<Product>("/products", "POST", productsData, token);
            return response;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Failed to create product');
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
    }, { rejectWithValue }) => {
        try {
            const response = await apiCall<Product[]>(
                `/products/search?searchedText=${encodeURIComponent(query)}`,
                "GET",
                undefined,
                token
            );
            return response;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Search failed');
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
    }, { rejectWithValue }) => {
        try {
            const response = await apiCall<Product>(`/products/${slug}`, "GET", undefined, token);
            return response;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Failed to fetch product');
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
    }, { rejectWithValue }) => {
        try {
            const response = await apiCall<Product>(`/products/${id}`, "PUT", data, token);
            return response;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Failed to update product');
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
    }, { rejectWithValue }) => {
        try {
            await apiCall(`/products/${id}`, "DELETE", undefined, token);
            return id;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Failed to delete product');
        }
    }
);