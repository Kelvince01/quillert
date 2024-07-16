import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/admin/layout/header';
import Sidebar from '@/components/admin/layout/sidebar';
import { auth } from '@/lib/auth';
import Providers from '@/components/admin/layout/providers';

export const metadata: Metadata = {
    title: 'Quillert | CMS',
    description: 'Admin Portal of Quillert Blog'
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    return (
        <Providers session={session}>
            <Header />
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-hidden pt-16">{children}</main>
            </div>
        </Providers>
    );
};

export default AdminLayout;
