import { createClient } from '@supabase/supabase-js';
import { getSession } from 'next-auth/react';

const session = getSession();
// const { supabaseAccessToken } = session;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        global: {
            headers: {
                // Authorization: `Bearer ${supabaseAccessToken}`
            }
        }
    }
);
