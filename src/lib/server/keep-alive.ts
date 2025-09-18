import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

class ServerKeepAlive {
    private interval: NodeJS.Timeout | null = null;

    start() {
        if (typeof window !== 'undefined') return; // Only run on server

        console.log('Starting server-side Supabase keep-alive');

        this.ping(); // Initial ping

        this.interval = setInterval(
            async () => {
                await this.ping();
            },
            10 * 60 * 1000
        ); // Every 10 minutes
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private async ping() {
        try {
            const { error } = await supabase.from('users').select('id').limit(1);

            if (error) {
                console.error('Server keep-alive failed:', error);
            } else {
                console.log('✅ Server keep-alive successful');
            }
        } catch (error) {
            console.error('Server keep-alive error:', error);
        }
    }
}

export const serverKeepAlive = new ServerKeepAlive();

/*
  // Initialize in your Next.js app
// In your _app.tsx or layout.tsx
if (typeof window === 'undefined') {
  serverKeepAlive.start()
}
  */
