import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/products';

const ProductCard: React.FC<{ product: Product; onDelete: () => void }> = ({ product, onDelete }) => {
  return (
    <div className="border rounded p-3 shadow-sm flex flex-col">
      <div className="h-40 w-full mb-3 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
        <img src={product.images?.[0] ?? '/placeholder.png'} alt={product.name} className="h-full object-cover" />
      </div>
      <h2 className="font-medium text-lg truncate">{product.name}</h2>
      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold">৳ {product.price}</p>
          <p className="text-xs text-gray-500">{product.category?.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link href={`/products/${product.slug}`} className="text-sm underline">View</Link>
          <Link href={`/products/edit/${product.id}`} className="text-sm underline">Edit</Link>
          <button onClick={onDelete} className="text-sm text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;