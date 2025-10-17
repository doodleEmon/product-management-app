import { Category } from "@/types/categories";

export interface Product {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    images: string[];
    createdAt: string;
    updatedAt: string;
    category: Category;
}

export interface ProductState {
    products: Product[];
    product: Product | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    searchLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    createLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    updateLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
    searchError: string | null;
    createError: string | null;
    updateError: string | null;
    searchQuery: string;
    currentPage: number;
    total: number;
    limit: number;
}

export interface ProductFormData {
    name: string,
    description: string,
    images: string[],
    price: number,
    categoryId: string
}

export interface ProductErrors {
    name?: string;
    description?: string;
    price?: string;
    categoryId?: string; // Changed from category
    images?: string; // Changed from image
    stock?: string;
}