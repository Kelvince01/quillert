'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '../icons';
import { useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function GoogleSignInButton() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const supabase = createClient();
    const router = useRouter();

    const signInWithGithub = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            router.push('/');
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }, [supabase, router]);

    return (
        <Button className="w-full mt-4" variant="outline" type="button" onClick={signInWithGithub}>
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Continue with Github
        </Button>
    );
}
