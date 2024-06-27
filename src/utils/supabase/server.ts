import { Database } from '@/types/database.types';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './base';

export const createClient = () => {
    const cookieStore = cookies();

    return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
        // Define a cookies object with methods for interacting with the cookie store and pass it to the client
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value, ...options });
                } catch (error) {
                    // The `set` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value: '', ...options });
                } catch (error) {
                    // The `delete` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            }
        }
    });
};

export default function useSupabaseServer(cookieStore: ReturnType<typeof cookies>) {
    return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            }
        }
    });
}
