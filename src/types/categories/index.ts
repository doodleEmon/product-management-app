export interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}