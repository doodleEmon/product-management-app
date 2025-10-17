// app/products/edit/[id]/page.tsx
"use client"

import ProductForm from '@/components/ProductForm';
import { getProducts } from '@/redux/actions/products';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const { authToken } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts({ token: authToken as string }));
    }
  }, [dispatch, products.length]);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-400">Loading product...</div>
      </div>
    );
  }

  return <ProductForm product={product} />;
}