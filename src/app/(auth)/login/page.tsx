'use client'

import React, { useState } from 'react'
import { MdOutlineEmail } from 'react-icons/md'

export default function Login() {

    const [errorMessageEmail, setErrorMessageEmail] = useState('');

    const handleLogin = () => { }

    return (
        <div className='w-full h-screen flex items-center justify-center p-4 lg:p-0'>
            <div className=' bg-[#4E6E5D] px-5 py-10 w-full lg:w-sm rounded-md'>
                <div className='flex flex-col items-center gap-y-2'>
                    <h1 className='text-white text-3xl font-bold'>Welcome back!</h1>
                    <small className='text-gray-300'>Login to access products and other features.</small>
                </div>
                <form onSubmit={handleLogin} className='flex flex-col items-center mt-8'>
                    {/* <input type="text" className='w-full bg-white px-4 py-3 text-gray-600 rounded focus:outline-none' placeholder='Enter your email' /> */}
                    <div className='w-full'>
                        <label className="text-sm text-white">Email</label>
                        <div className='relative w-full mt-1'>
                            <MdOutlineEmail size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 z-40" />
                            <input
                                type="text"
                                className="w-full bg-[#EFF1F3] pl-8 py-3 text-gray-600 rounded"
                                placeholder="john@gmail.com"
                                // value={formData.email}
                                // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <p className={`text-sm text-red-500 mt-2 ${errorMessageEmail ? 'block' : 'hidden'}`}>{errorMessageEmail}
                        </p>
                    </div>
                    <button type='submit' className='bg-slate-300 hover:bg-slate-400 w-full text-gray-600 hover:text-white px-3 py-2.5 mt-4 rounded cursor-pointer text-lg font-medium hover:shadow'>Login</button>
                </form>
            </div>
        </div>
    )
}
