'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CgSpinner } from 'react-icons/cg';

interface ProtectedLayoutProps {
    children: React.ReactNode;
    fallbackPath?: string;
}

export default function ProtectedLayout({
    children,
    fallbackPath = '/login'
}: ProtectedLayoutProps) {
    const { authToken } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!authToken) {
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

    if (!authToken) {
        return null;
    }

    return <>{children}</>;
}