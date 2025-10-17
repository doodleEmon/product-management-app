// components/ProductForm.tsx
"use client"

import { createProduct, updateProduct } from '@/redux/actions/products';
import { AppDispatch, RootState } from '@/redux/store';
import { Category } from '@/types/categories';
import { Product, ProductErrors, ProductFormData } from '@/types/products';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ProductFormProps {
    product?: Product | null;
    onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
    const isEditMode = !!product;

    const [formData, setFormData] = useState<ProductFormData>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        categoryId: product?.category.id || '',
        images: product?.images || ['']
    });

    const [errors, setErrors] = useState<ProductErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const dispatch = useDispatch<AppDispatch>();
    const { authToken } = useSelector((state: RootState) => state.auth);
    const { loading } = useSelector((state: RootState) => state.product);
    const { categories } = useSelector((state: RootState) => state.category);
    const router = useRouter();

    // Fixed validation function
    const validateField = (name: string, value: any): string => {
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
                // For price, we need to handle both string and number
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
                // Handle images array validation
                if (Array.isArray(value)) {
                    const firstImage = value[0] || '';
                    if (!firstImage.trim()) return 'Image URL is required!';
                    if (firstImage.trim() && !/^https?:\/\/.+\..+/.test(firstImage)) {
                        return 'Please enter a valid image URL!';
                    }
                }
                return '';

            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ProductErrors = {};
        let isValid = true;

        // Validate each field individually to handle different data types properly
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

        if (name === 'images') {
            // Handle images array - update first image
            setFormData(prev => ({
                ...prev,
                images: [value]
            }));
        } else if (name === 'price') {
            // Handle price input - always store as number
            setFormData(prev => ({ 
                ...prev, 
                price: value === '' ? 0 : Number(value) 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name as keyof ProductErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
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

        // Prepare data for backend - ensure price is a number
        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price), // Ensure it's a number
            categoryId: formData.categoryId,
            images: formData.images.filter(img => img.trim() !== ''),
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
            toast.error('An unexpected error occurred!');
        }
    };

    const shouldShowError = (field: keyof ProductErrors) => touched[field] && errors[field];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-[#1D232A] rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {isEditMode ? 'Edit Product' : 'Create New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product Name */}
                    <div>
                        <label className="label text-sm mb-1 text-white">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            className={`input focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${
                                shouldShowError('name') ? 'border-red-500' : 'border-gray-500'
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
                            className={`textarea focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${
                                shouldShowError('description') ? 'border-red-500' : 'border-gray-500'
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
                        <label className="label text-sm mb-1 text-white">Price ($) *</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            className={`input focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${
                                shouldShowError('price') ? 'border-red-500' : 'border-gray-500'
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
                            className={`select focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${
                                shouldShowError('categoryId') ? 'border-red-500' : 'border-gray-500'
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

                    {/* Image URL */}
                    <div>
                        <label className="label text-sm mb-1 text-white">Image URL *</label>
                        <input
                            type="text"
                            name="images"
                            className={`input focus:outline-none w-full border bg-[#2A323C] focus:border-white text-white ${
                                shouldShowError('images') ? 'border-red-500' : 'border-gray-500'
                            }`}
                            placeholder="https://example.com/image.jpg"
                            value={formData.images[0] || ''}
                            onChange={handleChange}
                            onBlur={() => handleBlur('images')}
                        />
                        <p className={`text-sm text-red-500 mt-2 ${shouldShowError('images') ? 'block' : 'hidden'}`}>
                            {errors.images}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading === 'pending'}
                        className="w-full p-3 mt-6 bg-indigo-600 rounded text-base cursor-pointer text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading === 'pending' ? (
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