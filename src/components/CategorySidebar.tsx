'use client'


import { getCategories } from '@/redux/actions/categories';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CategorySidebar: React.FC<{ selectedCategory: string | null; onSelectCategory: (id: string) => void; onClear: () => void }> = ({ selectedCategory, onSelectCategory, onClear }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { authToken } = useSelector((state: RootState) => state.auth);
    const { categories } = useSelector((state: RootState) => state.category);
    console.log("🚀 ~ CategorySidebar ~ categories:", categories)

    useEffect(() => {
        if (!categories.length && authToken) {
            dispatch(getCategories({ offset: 0, limit: 10, token: authToken }));
        }
    }, [categories.length, authToken, dispatch]);

    return (
        <div className="border rounded p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Categories</h3>
                <button onClick={onClear} className="text-sm text-blue-600">Clear</button>
            </div>
            <ul className="space-y-2">
                {categories.map((c) => (
                    <li key={c.id}>
                        <button
                            onClick={() => onSelectCategory(c.id)}
                            className={`w-full text-left px-2 py-1 rounded ${selectedCategory === c.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        >
                            {c.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;