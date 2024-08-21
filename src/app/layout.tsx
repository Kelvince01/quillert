import '@/styles/kmenu-variables.css';
import 'kmenu/dist/cmdk.css';
import '@uploadthing/react/styles.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/prose-mirror.css';
import React from 'react';
import { DESCRIPTION, TITLE } from '@/config';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import Toast from '@/components/common/cookie-consent';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
const siteOgImage = `${defaultUrl}/api/og`;

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    themeColor: '#1f2937',
    colorScheme: 'light'
};

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    metadataBase: new URL(defaultUrl),
    alternates: {
        canonical: new URL(defaultUrl)
    },
    referrer: 'origin-when-cross-origin',
    keywords: [
        'Technology',
        'News',
        'Trending',
        'Blog',
        'Software Development',
        'Interesting',
        'Facts',
        'General Knowledge',
        'Quillert',
        'Tutorials'
    ],
    authors: [{ name: 'Kelvince Phillips', url: 'https://quillert.com/' }],
    creator: 'Kelvince Phillips',
    publisher: 'Kelvince Phillips',
    manifest: '/manifest.json',
    icons: [
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
        {
            rel: 'icon',
            url: '/favicon.ico'
        }
    ],
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
            <head>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2005196002338454"
                    crossOrigin="anonymous"
                    strategy="lazyOnload"
                />
                {/* Global Site Tag (gtag.js) - Google Analytics */}
                <Script
                    strategy="afterInteractive"
                    defer
                    src={`https://www.googletagmanager.com/gtag/js?id=${`G-3HBWMQ557N`}`}
                />
                <Script
                    id="gtag-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${`G-3HBWMQ557N`}', {
                            page_path: window.location.pathname,
                            });
                          `
                    }}
                />
            </head>
            <body className={cn('min-h-screen font-sans antialiased', inter.variable)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toast />
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
