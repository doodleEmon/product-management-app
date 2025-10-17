'use client'

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/products';
import Image from 'next/image';

const ProductCard: React.FC<{ product: Product; onDelete: () => void }> = ({ product, onDelete }) => {
  return (
    <div className="border border-gray-600 hover:border-red-300 rounded p-4 shadow-sm hover:shadow-xl flex flex-col transition-all duration-150">
      <div className="h-40 w-full mb-3 bg-gray-100 flex items-center justify-center overflow-hidden rounded object-contain">
        <Link href={`/products/${product.slug}`}>
          <Image src={product.images?.[0] ?? '/placeholder.png'} alt={product.name} className="size-full" height={1000} width={1000} />
        </Link>
      </div>
      <Link href={`/products/${product.slug}`} className="font-medium text-lg line-clamp-1 hover:text-[#436a55]">{product.name}</Link>
      <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold">৳ {product.price}</p>
          <p className="text-xs text-indigo-500">{product.category?.name}</p>
        </div>
      </div>
      <div className="flex items-end gap-2 w-full mt-2">
        <Link href={`/products/edit/${product.id}`} className="text-sm border border-[#4E6E5D] text-[#4E6E5D] hover:text-white hover:bg-[#4E6E5D] w-1/2 text-center p-1.5 rounded transition-colors duration-150">Edit</Link>
        <button onClick={onDelete} className="text-sm border border-red-600 text-red-600 hover:text-white hover:bg-red-600 cursor-pointer w-1/2 p-1.5 rounded transition-colors duration-150">Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;