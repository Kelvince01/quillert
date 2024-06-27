import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import React from 'react';
import { DESCRIPTION, TITLE } from '@/config';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Nav from '@/components/layout/nav';
import { Main } from '@/components/craft';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
const siteOgImage = `${defaultUrl}/api/og`;

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    metadataBase: new URL(defaultUrl),
    referrer: 'origin-when-cross-origin',
    keywords: [
        'Vercel',
        'Supabase',
        'Next.js',
        'Blog',
        'Next.js',
        'Shadcn/ui',
        'Tailwind',
        'Radix UI',
        'Quillert',
        'Postgres'
    ],
    authors: [{ name: 'Kelvince Phillips', url: 'https://quillert.vercel.app/' }],
    creator: 'Kelvince Phillips',
    publisher: 'Kelvince Phillips',
    robots: { index: true, follow: true },
    icons: [
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
        {
            rel: 'icon',
            url: '/favicon.ico'
        }
    ],
    manifest: `${defaultUrl}/site.webmanifest`,
    openGraph: {
        url: defaultUrl,
        title: TITLE,
        description: DESCRIPTION,
        type: 'website',
        locale: 'en',
        siteName: TITLE,
        images: [
            {
                url: siteOgImage,
                width: 1200,
                height: 630,
                alt: TITLE
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        site: '@Kelvince_',
        creator: '@Kelvince_',
        title: TITLE,
        description: DESCRIPTION,
        images: [siteOgImage]
    },
    generator: 'Next.js'
};

// Revalidate content every hour
export const revalidate = 3600;

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn('min-h-screen font-sans antialiased', inter.variable)}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <Nav />
                    <Main>{children}</Main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
