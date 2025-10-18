// components/ProductForm.tsx
"use client"

import { getCategories } from '@/redux/actions/categories';
import { createProduct, updateProduct } from '@/redux/actions/products';
import { AppDispatch, RootState } from '@/redux/store';
import { Category } from '@/types/categories';
import { Product, ProductErrors, ProductFormData } from '@/types/products';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { MdDelete, MdCloudUpload } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ProductFormProps {
    product?: Product | null;
    onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
    const isEditMode = !!product;

    const [formData, setFormData] = useState<ProductFormData>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        categoryId: product?.category.id || '',
        images: product?.images || []
    });

    const [errors, setErrors] = useState<ProductErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Use the image upload hook
    const { uploadMultipleImages, uploading: imageUploading, error: uploadError } = useImageUpload();

    const dispatch = useDispatch<AppDispatch>();
    const { authToken } = useSelector((state: RootState) => state.auth);
    const { createLoading, updateLoading } = useSelector((state: RootState) => state.product);
    const { categories } = useSelector((state: RootState) => state.category);
    const router = useRouter();

    // Handle file selection and upload
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            // Convert FileList to array
            const fileArray = Array.from(files);

            // Upload images using the service
            const uploadedUrls = await uploadMultipleImages(fileArray);

            // Update form data with new image URLs
            const newImages = [...formData.images, ...uploadedUrls];
            setFormData(prev => ({
                ...prev,
                images: newImages
            }));

            // Update image previews
            setImagePreviews(prev => [...prev, ...uploadedUrls]);

            toast.success('Images uploaded successfully!');

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            // Error is already handled in the hook, just show toast
            console.error(error);
            toast.error(uploadError || 'Failed to upload images. Please try again.');
        }
    };

    // Remove image
    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
        setImagePreviews(newPreviews);
        toast.success('Image removed successfully!');
    };

    // Trigger file input click
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Fixed validation function
    const validateField = (name: string, value: string | number | string[]): string => {
        switch (name) {
            case 'name':
                const nameStr = String(value || '');
                if (!nameStr.trim()) return 'Product name is required!';
                if (nameStr.trim().length < 2) return 'Product name must be at least 2 characters!';
                return '';

            case 'description':
                const descStr = String(value || '');
                if (!descStr.trim()) return 'Description is required!';
                if (descStr.trim().length < 10) return 'Description must be at least 10 characters!';
                return '';

            case 'price':
                const priceValue = value;
                if (priceValue === '' || priceValue === null || priceValue === undefined) {
                    return 'Price is required!';
                }
                if (isNaN(Number(priceValue)) || Number(priceValue) <= 0) {
                    return 'Price must be a positive number!';
                }
                return '';

            case 'categoryId':
                const categoryStr = String(value || '');
                if (!categoryStr.trim()) return 'Category is required!';
                return '';

            case 'images':
                if (Array.isArray(value) && value.length === 0) {
                    return 'At least one image is required!';
                }
                return '';

            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ProductErrors = {};
        let isValid = true;

        const nameError = validateField('name', formData.name);
        if (nameError) {
            newErrors.name = nameError;
            isValid = false;
        }

        const descriptionError = validateField('description', formData.description);
        if (descriptionError) {
            newErrors.description = descriptionError;
            isValid = false;
        }

        const priceError = validateField('price', formData.price);
        if (priceError) {
            newErrors.price = priceError;
            isValid = false;
        }

        const categoryError = validateField('categoryId', formData.categoryId);
        if (categoryError) {
            newErrors.categoryId = categoryError;
            isValid = false;
        }

        const imagesError = validateField('images', formData.images);
        if (imagesError) {
            newErrors.images = imagesError;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        const error = validateField(field, formData[field as keyof ProductFormData]);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'price') {
            setFormData(prev => ({
                ...prev,
                price: value === '' ? 0 : Number(value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name as keyof ProductErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        const isValid = validateForm();
        if (!isValid) {
            toast.error("Please fix the validation errors before submitting!");
            return;
        }

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            categoryId: formData.categoryId,
            images: formData.images,
        };

        try {
            let res;
            if (isEditMode && product?.id) {
                res = await dispatch(updateProduct({
                    id: product.id,
                    data: productData,
                    token: authToken as string
                }));
            } else {
                res = await dispatch(createProduct({
                    productsData: productData,
                    token: authToken as string
                }));
            }

            if (createProduct.fulfilled.match(res) || updateProduct.fulfilled.match(res)) {
                toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/products');
                }
            } else {
                const errorMessage = res.payload as string || `Failed to ${isEditMode ? 'update' : 'create'} product!`;
                toast.error(errorMessage);
            }
        } catch (error) {
            let message = 'An unexpected error occurred!';

            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            } else if (typeof (error as any)?.response?.data?.message === 'string') {
                message = (error as any).response.data.message;
            }

            toast.error(message);
        }
    };

    const shouldShowError = (field: keyof ProductErrors) => touched[field] && errors[field];

    useEffect(() => {
        if (!categories.length && authToken) {
            dispatch(getCategories({ token: authToken }));
        }
    }, [categories.length, authToken, dispatch]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-[#282c31] rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {isEditMode ? 'Edit Product' : 'Create New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product Name */}
                    <div>
                        <label className="label text-sm text-white">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            className={`input py-2.5 px-4 rounded-md mt-1 focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${shouldShowError('name') ? 'border-red-500' : 'border-gray-500'
                                }`}
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                        />
                        <p className={`text-sm text-red-500 mt-2 ${shouldShowError('name') ? 'block' : 'hidden'}`}>
                            {errors.name}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label text-sm mb-1 text-white">Description *</label>
                        <textarea
                            name="description"
                            rows={4}
                            className={`textarea py-2.5 px-4 rounded-md mt-1 focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${shouldShowError('description') ? 'border-red-500' : 'border-gray-500'
                                }`}
                            placeholder="Enter product description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={() => handleBlur('description')}
                        />
                        <p className={`text-sm text-red-500 mt-2 ${shouldShowError('description') ? 'block' : 'hidden'}`}>
                            {errors.description}
                        </p>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="label text-sm mb-1 text-white">Price (৳) *</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            className={`input py-2.5 px-4 rounded-md mt-1 focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${shouldShowError('price') ? 'border-red-500' : 'border-gray-500'
                                }`}
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            onBlur={() => handleBlur('price')}
                        />
                        <p className={`text-sm text-red-500 mt-2 ${shouldShowError('price') ? 'block' : 'hidden'}`}>
                            {errors.price}
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="label text-sm mb-1 text-white">Category *</label>
                        <select
                            name="categoryId"
                            className={`select py-2.5 px-4 rounded-md mt-1 focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${shouldShowError('categoryId') ? 'border-red-500' : 'border-gray-500'
                                }`}
                            value={formData.categoryId}
                            onChange={handleChange}
                            onBlur={() => handleBlur('categoryId')}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category: Category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <p className={`text-sm text-red-500 mt-2 ${shouldShowError('categoryId') ? 'block' : 'hidden'}`}>
                            {errors.categoryId}
                        </p>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div>
                            <label className="label text-sm text-white mb-2">Image Previews</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {imagePreviews.map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={imageUrl}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                                            height={1000}
                                            width={1000}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 transition-opacity"
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="label text-sm text-white">Product Images *</label>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />

                        {/* Upload button */}
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            disabled={imageUploading}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-500 rounded-lg text-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {imageUploading ? (
                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                    <CgSpinner size={20} className="animate-spin" />
                                    <span>Uploading images...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                    <MdCloudUpload size={24} />
                                    <span>Click to upload images or drag and drop</span>
                                </div>
                            )}
                        </button>

                        <p className="text-xs text-gray-400 mt-2">
                            Supported formats: JPG, PNG, GIF, WEBP. Max size: 10MB per image.
                        </p>

                        <p className={`text-sm text-red-500 mt-2 ${shouldShowError('images') ? 'block' : 'hidden'}`}>
                            {errors.images}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={createLoading === 'pending' || updateLoading === 'pending' || imageUploading}
                        className="w-full p-3 mt-6 bg-[#4E6E5D] rounded text-base cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createLoading === 'pending' || updateLoading === 'pending' ? (
                            <span className="flex items-center justify-center gap-x-1">
                                <CgSpinner size={16} className="animate-spin" />
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : (
                            <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}