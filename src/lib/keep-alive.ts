import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

class SupabaseKeepAlive {
    private intervalId: NodeJS.Timeout | null = null;
    private isRunning = false;

    constructor(private intervalMinutes = 10) {}

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        console.log(`Starting Supabase keep-alive every ${this.intervalMinutes} minutes`);

        // Initial ping
        this.ping();

        // Set up interval
        this.intervalId = setInterval(
            () => {
                this.ping();
            },
            this.intervalMinutes * 60 * 1000
        );
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('Supabase keep-alive stopped');
    }

    private async ping() {
        try {
            const { data, error } = await supabase.from('users').select('count').limit(1);

            if (error) {
                console.error('Keep-alive ping failed:', error);
                return;
            }

            console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
        } catch (error) {
            console.error('Keep-alive ping error:', error);
        }
    }
}

// Export singleton instance
export const keepAlive = new SupabaseKeepAlive(10); // Ping every 10 minutes
