'use client'


import { getCategories } from '@/redux/actions/categories';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CategorySidebar: React.FC<{ selectedCategory: string | null; onSelectCategory: (id: string) => void; onClear: () => void }> = ({ selectedCategory, onSelectCategory, onClear }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { authToken } = useSelector((state: RootState) => state.auth);
    const { categories } = useSelector((state: RootState) => state.category);

    useEffect(() => {
        if (!categories.length && authToken) {
            dispatch(getCategories({ token: authToken }));
        }
    }, [categories.length, authToken, dispatch]);

    return (
        <div className="border rounded p-4 bg-[#EFF1F3] w-full lg:w-64">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Categories</h3>
                <button onClick={onClear} className="text-sm text-blue-600 cursor-pointer">Clear</button>
            </div>
            <ul className="space-y-2">
                {categories.map((c) => (
                    <li key={c.id}>
                        <button
                            onClick={() => onSelectCategory(c.id)}
                            className={`w-full text-left px-4 py-1.5 rounded cursor-pointer ${selectedCategory === c.id ? 'bg-[#4E6E5D] text-white' : 'bg-gray-200 hover:bg-[#4E6E5D] hover:text-white'}`}
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