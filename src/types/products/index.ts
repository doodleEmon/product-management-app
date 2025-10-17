
export interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
}

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
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}