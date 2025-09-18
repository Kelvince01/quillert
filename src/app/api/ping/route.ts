// Simple lightweight ping endpoint

import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = createClient();

        // Minimal database ping
        const { error } = await supabase.from('users').select('id').limit(1);

        if (error) {
            console.error('Ping failed:', error);
            return Response.json(
                {
                    status: 'error',
                    message: error.message,
                    timestamp: new Date().toISOString()
                },
                { status: 500 }
            );
        }

        return Response.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Database connection active'
        });
    } catch (error) {
        console.error('Ping error:', error);
        return Response.json(
            {
                status: 'error',
                message: 'Internal server error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
