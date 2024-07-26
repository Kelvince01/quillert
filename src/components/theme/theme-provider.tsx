'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { TooltipProvider } from '../ui/tooltip';
import { Toaster } from '../ui/toaster';
import { Dimensions, MenuProvider } from 'kmenu';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const dimensions: Dimensions = {
        // sectionHeight: 30,
        // commandHeight: 50
    };

    return (
        <NextThemesProvider {...props}>
            <TooltipProvider>
                <Toaster />
                <MenuProvider dimensions={dimensions}>{children}</MenuProvider>
            </TooltipProvider>
        </NextThemesProvider>
    );
}
