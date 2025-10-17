'use client'


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getProducts, searchProducts, deleteProduct } from '@/redux/actions/products';
import useDebounce from '@/hooks/useDebounce';
import { setCurrentPage } from '@/redux/slices/product';
import ProductCard from './ProductCard';
import Pagination from '@/components/Pagination';
import { ConfirmModal } from '@/components/ConfirmModal';
import CategorySidebar from '@/components/CategorySidebar';
import Loader from '@/components/Loader';

const ProductsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error, currentPage, limit } = useSelector((state: RootState) => state.product);
    const { authToken } = useSelector((state: RootState) => state.auth);
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 400);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [toDelete, setToDelete] = useState<{ id: string; name?: string } | null>(null);

    useEffect(() => {
        // If there's a search query use search endpoint, otherwise fetch paginated products
        if (debouncedQuery) {
            dispatch(searchProducts({ query: debouncedQuery, token: authToken as string }));
        } else {
            const offset = (currentPage - 1) * limit;
            dispatch(getProducts({ offset, limit, categoryId: selectedCategory ?? undefined, token: authToken as string }));
        }
    }, [debouncedQuery, currentPage, authToken, selectedCategory]);

    useEffect(() => {
        // reset to page 1 when category changes or search cleared
        dispatch(setCurrentPage(1));
    }, [selectedCategory, debouncedQuery]);

    const onConfirmDelete = async () => {
        if (!toDelete) return;
        await dispatch(deleteProduct({ id: toDelete.id, token: authToken as string }));
        // After delete, re-fetch current page
        const offset = (currentPage - 1) * limit;
        dispatch(getProducts({ offset, limit, categoryId: selectedCategory ?? undefined, token: authToken as string }));
        setToDelete(null);
    };

    return (
        <div className="flex gap-6 p-6">
            <aside className="w-72">
                <CategorySidebar
                    selectedCategory={selectedCategory}
                    onSelectCategory={(id) => setSelectedCategory(id)}
                    onClear={() => setSelectedCategory(null)}
                />
            </aside>

            <main className="flex-1">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <div className="w-1/3">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products by name..."
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>

                {loading && <div>
                    <Loader />
                </div>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && products.length === 0 && <p>No products found.</p>}

                <div className="grid grid-cols-3 gap-4">
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onDelete={() => setToDelete({ id: p.id, name: p.name })}
                        />
                    ))}
                </div>

                <div className="mt-6">
                    <Pagination
                        onPageChange={(page) => dispatch(setCurrentPage(page))}
                        currentPage={currentPage}
                        pageSize={limit}
                        totalItems={150}
                    />
                </div>
            </main>

            <ConfirmModal
                open={!!toDelete}
                message={`Are you sure you want to delete "${toDelete?.name ?? ''}"?`}
                onClose={() => setToDelete(null)}
                onConfirm={onConfirmDelete}
            />
        </div>
    );
};

export default ProductsPage;