import { useEffect, useRef } from 'react';

export function useSupabaseKeepAlive(intervalMinutes = 15) {
    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const ping = async () => {
            try {
                const response = await fetch('/api/keepalive');
                if (!response.ok) {
                    console.warn('Keep-alive ping failed:', response.status);
                }
            } catch (error) {
                console.error('Keep-alive ping error:', error);
            }
        };

        // Initial ping
        ping();

        // Set up interval
        intervalRef.current = setInterval(ping, intervalMinutes * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [intervalMinutes]);
}
