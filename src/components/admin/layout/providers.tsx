'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type SessionContextType = {
    session: Session | null;
    user: User | null;
    supabase: SupabaseClient;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient());
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function setupSession() {
            const {
                data: { subscription }
            } = supabase.auth.onAuthStateChange(async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    if (event === 'SIGNED_IN') {
                        try {
                            const { data: profile, error } = await supabase
                                .from('users')
                                .select('*')
                                .eq('id', session.user.id)
                                .single();

                            if (error && error.code === 'PGRST116') {
                                // Profile doesn't exist, so this is a new user
                                const { error: insertError } = await supabase.from('users').insert({
                                    id: session.user.id,
                                    email: session.user.email,
                                    name: session.user.user_metadata.full_name,
                                    image: session.user.user_metadata.avatar_url
                                });

                                if (insertError) {
                                    console.error('Error creating user profile:', insertError);
                                }
                            } else if (error) {
                                console.error('Error fetching user profile:', error);
                            } else {
                                setUser((prevUser) => ({ ...prevUser, ...profile }));
                            }
                        } catch (error) {
                            console.error('Error in session setup:', error);
                        }
                    }
                }

                setIsLoading(false);

                if (!session) {
                    router.push('/accounts/login');
                }
            });

            const {
                data: { session }
            } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);

            if (!session) {
                router.push('/accounts/login');
            }

            return () => {
                subscription.unsubscribe();
            };
        }

        setupSession();
    }, [supabase, router]);

    const signOut = useCallback(async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            router.push('/accounts/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }, [supabase, router]);

    const value = {
        session,
        supabase,
        user,
        isLoading,
        signOut
    };

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
