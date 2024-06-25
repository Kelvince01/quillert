import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import React from "react";
import {DESCRIPTION, TITLE} from "@/config";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Nav from "@/components/layout/nav";
import { Main } from "@/components/craft";
import Footer from "@/components/layout/footer";
import {cn} from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] ,
  variable: "--font-sans"});

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

// Revalidate content every hour
export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={cn("min-h-screen font-sans antialiased", inter.variable)}
      >
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <Nav/>
        <Main>{children}</Main>
        <Footer/>
      </ThemeProvider>
      </body>
      </html>
  );
}
