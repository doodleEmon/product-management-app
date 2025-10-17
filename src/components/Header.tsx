'use client'

import { logout } from '@/redux/slices/auth'
import { AppDispatch } from '@/redux/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleLogout = () => {
        const res = dispatch(logout());
        if (res) {
            toast.success('Successfully logged out.');
            router.push('/login')
        }
    }

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past 100px - hide header
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show header
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlHeader, { passive: true });

        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [lastScrollY]);

    return (
        <header className={`flex items-center justify-between px-4 lg:px-10 h-16 bg-[#4E6E5D] fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
            <Link href={'/products'} className='text-2xl font-bold capitalize text-white'>
                Pro-Manager
            </Link>
            <button 
                onClick={handleLogout} 
                type='button' 
                className='text-white hover:bg-white hover:text-[#4E6E5D] border px-4 py-1.5 cursor-pointer rounded transition-colors duration-200 hover:border-white flex items-center gap-x-1'
            >
                <BiLogOut className='rotate-180' /> Logout
            </button>
        </header>
    )
}