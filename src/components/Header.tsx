'use client'

import { logout } from '@/redux/slices/auth'
import { AppDispatch } from '@/redux/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();


    const handleLogout = () => {
        const res = dispatch(logout());
        if (res) {
            toast.success('Successfully logged out.');
            router.push('/login')
        }
    }

    return (
        <header className='flex items-center justify-between px-4 lg:px-10 py-4 bg-[#4E6E5D]'>
            <Link href={'/products'} className='text-2xl font-bold capitalize text-white'>
                Pro-Manager
            </Link>
            <button onClick={handleLogout} type='button' className='text-white hover:bg-white hover:text-[#4E6E5D] border px-4 py-1.5 cursor-pointer rounded transition-colors duration-200 hover:border-white flex items-center gap-x-1'>
                <BiLogOut className='rotate-180' /> Logout
            </button>
        </header>
    )
}
