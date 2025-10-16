'use client'

import { login } from '@/redux/actions/auth';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { CgSpinner } from 'react-icons/cg';
import { MdOutlineEmail } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Login() {
    const [emailData, setEmailData] = useState<string>('')
    const [errorEmail, setErrorEmail] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { authLoading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const validateData = () => {
        let isValid = true;

        setErrorEmail('');

        // email
        if (!emailData.trim()) {
            setErrorEmail('Email is required!')
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData)) {
            setErrorEmail('Enter a valid email address!')
            isValid = false;
        }

        return isValid;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = validateData();
        if (!success) {
            // toast.error("Unable to proceed. Please provide valid information!");
            return;
        }

        const res = await dispatch(login(emailData));
        console.log("🚀 ~ handleSubmit ~ res-login:", res)

        if (login.fulfilled.match(res)) {
            router.push("/products");
            toast.success("Login successful!");
        } else {
            const errorMessage = res.payload as string || "Login failed!";
            toast.error(errorMessage);
        }
    }

    return (
        <div className='w-full h-screen flex items-center justify-center p-4 lg:p-0'>
            <div className=' bg-[#4E6E5D] px-6 py-10 w-full lg:w-sm rounded-md'>
                <div className='flex flex-col items-center gap-y-2'>
                    <h1 className='text-white text-3xl font-bold'>Welcome back!</h1>
                    <small className='text-gray-300'>Login to access products and other features.</small>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col items-center mt-8'>
                    <div className='w-full'>
                        <label className="text-sm text-white">Email</label>
                        <div className='relative w-full mt-1'>
                            <MdOutlineEmail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-40" />
                            <input
                                type="text"
                                className="w-full bg-[#EFF1F3] pl-10 pr-4 py-3 text-gray-500 rounded"
                                placeholder="john@gmail.com"
                                value={emailData}
                                onChange={(e) => setEmailData(e.target.value)}
                            />
                        </div>
                        <p className={`text-sm text-red-400 mt-2 ${errorEmail ? 'block' : 'hidden'}`}>{errorEmail}
                        </p>
                    </div>
                    <button type='submit' className='bg-slate-300 hover:bg-slate-400 w-full text-gray-600 hover:text-white px-3 py-2.5 mt-4 rounded cursor-pointer text-lg font-medium hover:shadow transition-colors duration-200'>
                        {
                            authLoading === 'pending' ? <span className='flex items-center justify-center gap-x-1'><CgSpinner size={16} className="animate-spin" /> Logging in...</span> : <span>Login</span>
                        }
                    </button>
                    {/* <button type='submit' className="p-3 mt-4 bg-indigo-600 rounded text-base cursor-pointer text-center">{loading === 'pending' ? <span className='flex items-center justify-center gap-x-1'><CgSpinner size={16} className="animate-spin" /> Logging in...</span> : <span>Login</span>}</button> */}
                </form>
            </div>
        </div>
    )
}
