import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

let lastPing = 0;
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

export async function middleware(request: NextRequest) {
    const now = Date.now();

    // Only ping if enough time has passed and it's not the keepalive endpoint
    if (now - lastPing > PING_INTERVAL && !request.nextUrl.pathname.includes('/api/keepalive')) {
        lastPing = now;

        // Trigger keep-alive in background (non-blocking)
        fetch(`${request.nextUrl.origin}/api/keepalive`).catch((error) =>
            console.error('Background keep-alive failed:', error)
        );
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
