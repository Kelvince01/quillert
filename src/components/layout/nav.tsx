'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { mainMenu } from '@/config/menu.config';
import Logo from '../../../public/app-logo.png';
import { MobileNav } from '../nav/mobile-nav';
import { NavProps } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { PostSearch } from '../posts/post-search';

const Nav = ({ className, children, id }: NavProps) => {
    const [supabase] = useState(() => createClient());
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function getSession() {
            const { data: session } = await supabase.auth.getSession();
            setSession(session.session!);
        }

        getSession();
    });

    const signOut = useCallback(async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            router.push('/accounts/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }, [supabase, router]);

    return (
        <nav
            className={cn('sticky z-50 top-0 bg-background', 'border-b', 'fade-in', className)}
            id={id}
        >
            <div
                id="nav-container"
                className="max-w-5xl mx-auto py-2 px-6 sm:px-8 flex justify-between items-center"
            >
                <Link className="hover:opacity-75 transition-all flex gap-2 items-center" href="/">
                    <h2 className="sr-only">Quillert</h2>
                    <Image
                        src={Logo}
                        alt="Logo"
                        className="dark:invert"
                        width={84}
                        height={30.54}
                    ></Image>
                </Link>
                {children}
                <div className="flex items-center gap-2">
                    <div className="mx-2 hidden md:flex">
                        {Object.entries(mainMenu).map(([key, href]) => (
                            <Button key={href} asChild variant="ghost" size="sm">
                                <Link href={href}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Link>
                            </Button>
                        ))}
                    </div>
                    <PostSearch />
                    {session ? (
                        <Button className="sm:flex" onClick={signOut}>
                            Logout
                        </Button>
                    ) : (
                        <Button asChild className="sm:flex">
                            <Link href="/accounts/login">Login</Link>
                        </Button>
                    )}

                    <MobileNav />
                </div>
            </div>
        </nav>
    );
};

export default Nav;
