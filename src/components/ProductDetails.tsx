'use client'

import { deleteProduct, getProductBySlug, getProducts } from "@/redux/actions/products";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiChevronLeft, BiEdit } from "react-icons/bi";
import { BsTrash2 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmModal } from "./ConfirmModal";
import { toast } from "react-toastify";

export function ProductDetails() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { slug } = useParams<{ slug: string }>();
    const { authToken } = useSelector((state: RootState) => state.auth);
    const { product, currentPage, limit } = useSelector((state: RootState) => state.product);
    const [toDelete, setToDelete] = useState<{ id: string; name?: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('/placeholder.png');

    useEffect(() => {
        if (!slug) return;
        dispatch(getProductBySlug({ slug, token: authToken as string }));
    }, [dispatch, slug, authToken]);

    const images = product?.images?.length ? product.images : ['/placeholder.png'];

    // Whenever product changes, reset selected image
    useEffect(() => {
        if (product?.images?.length) {
            setSelectedImage(product.images[0]);
        } else {
            setSelectedImage('/placeholder.png');
        }
    }, [product]);

    const onConfirmDelete = async () => {
        if (!toDelete) return;

        const result = await dispatch(
            deleteProduct({ id: toDelete.id, token: authToken as string })
        );

        if (deleteProduct.fulfilled.match(result)) {
            toast.success('Product deleted successfully!');

            const offset = (currentPage - 1) * limit;
            dispatch(
                getProducts({
                    offset,
                    limit,
                    categoryId: product?.category.id,
                    token: authToken as string,
                })
            );

            setToDelete(null);
        } else {
            toast.error('Failed to delete product.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="border-b border-gray-200 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white transition-colors py-2 pl-2 pr-4 rounded-md cursor-pointer w-full md:w-1/3 lg:w-1/5 justify-center"
                >
                    <BiChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Products</span>
                </button>

                <div className="flex gap-3 w-full lg:w-auto justify-center sm:justify-end">
                    <button
                        onClick={() => router.push(`/products/edit/${product?.id}`)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#4E6E5D] text-[#4E6E5D] hover:text-white hover:bg-[#4E6E5D] transition-colors duration-150 cursor-pointer text-sm lg:text-base w-full lg:w-auto"
                    >
                        <BiEdit className="w-5 h-5" />
                        Edit Product
                    </button>
                    <button
                        onClick={() => setToDelete({ id: product?.id as string, name: product?.name })}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-red-600 text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-150 text-sm sm:text-base cursor-pointer"
                    >
                        <BsTrash2 className="w-5 h-5" />
                        Delete Product
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8 space-y-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Image Section */}
                    <div className="w-full lg:w-80">
                        {/* Main Image */}
                        <div className="relative w-full lg:w-80 h-72 md:h-80 bg-gray-50 rounded-lg overflow-hidden">
                            <Image
                                src={selectedImage}
                                alt={product?.name || 'Product image'}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
                            {images.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${selectedImage === img
                                        ? 'border-blue-600'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product?.name} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="flex-1 space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                {product?.category?.name || 'Uncategorized'}
                            </span>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                                {product?.name}
                            </h1>

                            <p className="text-lg sm:text-xl font-semibold text-gray-900">
                                ৳{product?.price ?? '—'}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                {product?.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Product Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Created</p>
                                <p className="text-gray-900 text-sm sm:text-base">
                                    {product?.createdAt
                                        ? new Date(product.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                        : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Updated</p>
                                <p className="text-gray-900 text-sm sm:text-base">
                                    {product?.updatedAt
                                        ? new Date(product.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={!!toDelete}
                message={`Are you sure you want to delete "${toDelete?.name ?? ''}"?`}
                onClose={() => setToDelete(null)}
                onConfirm={onConfirmDelete}
            />
        </div>
    );
}
