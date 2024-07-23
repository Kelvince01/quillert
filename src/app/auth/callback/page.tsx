'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/admin/layout/providers';

export default function AuthCallback() {
    const router = useRouter();
    const { supabase } = useSession();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const {
                    data: { session },
                    error
                } = await supabase.auth.getSession();
                if (error) throw error;
                if (session) {
                    router.push('/dashboard'); // or wherever you want to redirect after successful sign-in
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error handling auth callback:', error);
                router.push('/accounts/login');
            }
        };

        handleCallback();
    }, [supabase, router]);

    return <div>Loading...</div>;
}
