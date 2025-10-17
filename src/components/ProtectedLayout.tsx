'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.replace('/login');
        } else {
            setAuthChecked(true);
        }
    }, [router]);

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
