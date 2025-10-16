// components/PublicLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { CgSpinner } from 'react-icons/cg';

interface PublicLayoutProps {
    children: React.ReactNode;
    fallbackPath?: string;
}

export default function PublicLayout({
    children,
    fallbackPath = '/products'
}: PublicLayoutProps) {
    const { authToken } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {

        if (authToken) {
            console.log('Token exists, redirecting from public route to:', fallbackPath);
            router.push(fallbackPath);
        } else {
            setIsChecking(false);
        }
    }, [authToken, router, fallbackPath]);

    if (isChecking || authToken === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg animate-spin">
                    <CgSpinner size={24} />
                </div>
            </div>
        );
    }

    if (authToken) {
        return null;
    }

    return <>{children}</>;
}