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
    loading: boolean;
    error: string | null;
    searchQuery: string;
    currentPage: number;
    total: number;
    limit: number;
}