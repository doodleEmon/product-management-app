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
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';

const ProductsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, searchLoading, error, searchError, currentPage, limit, total, hasMore } = useSelector((state: RootState) => state.product);
    const { authToken } = useSelector((state: RootState) => state.auth);
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 400);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [toDelete, setToDelete] = useState<{ id: string; name?: string } | null>(null);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Determine if we're in search mode
    const isSearchMode = debouncedQuery.trim().length > 0;
    const activeLoading = isSearchMode ? searchLoading : loading;
    const activeError = isSearchMode ? searchError : error;

    // Fetch products based on search or normal mode
    useEffect(() => {
        if (!authToken) return;

        if (isSearchMode) {
            // Search mode - no pagination, no category filter
            dispatch(searchProducts({ query: debouncedQuery.trim(), token: authToken }));
        } else {
            // Normal mode - with pagination and category filter
            const offset = (currentPage - 1) * limit;
            dispatch(getProducts({
                offset,
                limit,
                categoryId: selectedCategory ?? undefined,
                token: authToken
            }));
        }
    }, [debouncedQuery, currentPage, selectedCategory, authToken, isSearchMode, limit]);

    // Reset to page 1 when search query or category changes (but avoid infinite loop)
    useEffect(() => {
        if (currentPage !== 1) {
            dispatch(setCurrentPage(1));
        }
    }, [selectedCategory, debouncedQuery]);

    const refreshProducts = () => {
        if (!authToken) return;

        if (isSearchMode) {
            dispatch(searchProducts({ query: debouncedQuery.trim(), token: authToken }));
        } else {
            const offset = (currentPage - 1) * limit;
            dispatch(getProducts({
                offset,
                limit,
                categoryId: selectedCategory ?? undefined,
                token: authToken,
            }));
        }
    };

    const onConfirmDelete = async () => {
        if (!toDelete || !authToken) return;

        const result = await dispatch(
            deleteProduct({ id: toDelete.id, token: authToken })
        );

        if (deleteProduct.fulfilled.match(result)) {
            toast.success('Product deleted successfully!');

            // Check if we need to go back a page
            const remainingOnPage = products.length - 1;

            if (remainingOnPage === 0 && currentPage > 1) {
                // Last item on page deleted and not on first page - go back
                dispatch(setCurrentPage(currentPage - 1));
            } else {
                // Refresh current page
                refreshProducts();
            }

            setToDelete(null);
        } else {
            toast.error('Failed to delete product.');
        }
    };

    const handleCategorySelect = (id: string | null) => {
        setSelectedCategory(id);
        setShowMobileSidebar(false);
        setQuery(''); // Clear search when selecting category
    };

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate pagination visibility
    const totalPages = Math.ceil(total / limit);
    const showPagination = !isSearchMode && (hasMore || totalPages > 1);

    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 min-h-screen">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-4">
                <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="p-2 border rounded-lg bg-white shadow-sm"
                >
                    {showMobileSidebar ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
                <h1 className="text-xl font-semibold flex-1 text-center">Products</h1>
            </div>

            {/* Sidebar - Mobile Overlay and Desktop Fixed */}
            <div className={`
                ${showMobileSidebar ? 'fixed inset-0 z-40 bg-black/50' : 'hidden'} 
                lg:relative lg:block
            `} onClick={() => setShowMobileSidebar(false)}>
                <div
                    className={`
                        ${showMobileSidebar ? 'fixed left-0 top-0 h-full w-80 max-w-[80vw] z-50' : 'relative w-full'}
                        bg-white p-4 lg:p-0 transition-transform duration-300
                        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between lg:hidden mb-4 pt-16">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <button
                            onClick={() => setShowMobileSidebar(false)}
                            className="p-1 cursor-pointer"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    <CategorySidebar
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                        onClear={() => handleCategorySelect(null)}
                    />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full">
                {/* Header Section */}
                <div className="mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    <h1 className="text-2xl font-semibold hidden lg:block">Products</h1>

                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <Link href={'/products/create'} className='hover:bg-[#4E6E5D] text-[#4E6E5D] border border-[#4E6E5D] hover:text-white px-4 py-1.5 cursor-pointer rounded-lg flex items-center justify-center gap-x-2 font-semibold transition-colors duration-200 whitespace-nowrap lg:hidden'>
                            <span className='text-base'>+</span> Create
                        </Link>

                        <div className="flex-1 min-w-0 relative">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products by name..."
                                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E6E5D] focus:border-transparent"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    aria-label="Clear search"
                                >
                                    <FiX size={20} />
                                </button>
                            )}
                        </div>

                        <Link href={'/products/create'} className='hover:bg-[#4E6E5D] text-[#4E6E5D] border border-[#4E6E5D] hover:text-white px-4 cursor-pointer rounded-lg hidden lg:flex items-center justify-center gap-x-2 font-semibold transition-colors duration-200 whitespace-nowrap'>
                            <span className='text-base'>+</span> Create
                        </Link>
                    </div>
                </div>

                {/* Search Info Banner */}
                {isSearchMode && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span>
                            Searching for: <strong>{debouncedQuery}</strong>
                            {activeLoading === 'succeeded' && ` (${products.length} result${products.length !== 1 ? 's' : ''})`}
                        </span>
                        <button
                            onClick={() => setQuery('')}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {activeLoading === 'pending' && (
                    <div className='flex justify-center items-center h-[70%] py-8'>
                        <Loader />
                    </div>
                )}

                {/* Error State */}
                {activeError && activeLoading !== 'pending' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {activeError}
                    </div>
                )}

                {/* Empty State */}
                {activeLoading === 'succeeded' && products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">
                            {isSearchMode
                                ? `No products found for "${debouncedQuery}"`
                                : 'No products found.'
                            }
                        </p>
                        <p className="text-sm mt-2">
                            {isSearchMode
                                ? 'Try a different search term'
                                : 'Try adjusting your filters or create a new product'
                            }
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                {activeLoading === 'succeeded' && products.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onDelete={() => setToDelete({ id: p.id, name: p.name })}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {showPagination && (
                            <div className="mt-6 lg:mt-8 flex justify-center">
                                <Pagination
                                    onPageChange={handlePageChange}
                                    currentPage={currentPage}
                                    pageSize={limit}
                                    totalItems={total}
                                />
                            </div>
                        )}

                        {/* Results info for single page */}
                        {!showPagination && !isSearchMode && (
                            <div className="mt-6 text-center text-sm text-gray-600">
                                Showing {products.length} product{products.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Delete Confirmation Modal */}
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