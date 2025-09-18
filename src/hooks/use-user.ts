'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session?.user ?? null);
                setLoading(false);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
                router.push('/accounts/login'); // Redirect to login page after sign out
            }
        });

        getUser();

        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return { user, loading, signOut };
}
