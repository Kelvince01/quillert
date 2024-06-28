import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface AccountsLayoutProps {
    children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Accounts | Quillert',
        description: 'Accounts for Quillert'
    };
}

export default async function AccountsLayout({
    children // will be a page or nested layout
}: AccountsLayoutProps) {
    const session = await createClient().auth.getUser();
    if (session?.data.user) redirect(`/`);

    return (
        <main className="px-4 py-8 md:px-6 lg:px-8 bg-[#eff3f8] bg-muted h-screen">
            {/* Include shared UI here e.g. a header or sidebar */}

            <React.Fragment>{children}</React.Fragment>
        </main>
    );
}
