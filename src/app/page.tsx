// /app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            router.replace('/products')
        } else {
            router.replace('/login')
        }
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader />
        </div>
    )
}