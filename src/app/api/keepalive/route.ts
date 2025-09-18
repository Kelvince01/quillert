import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = createClient();

        const { data, error } = await supabase.from('users').select('id').limit(1);

        if (error) {
            console.error('Keep-alive error:', error);
            return Response.json({ error: 'Database query failed' }, { status: 500 });
        }

        console.log(`Keep-alive ping successful at ${new Date().toISOString()}`);
        return Response.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            message: 'Database is active'
        });
    } catch (error) {
        console.error('Keep-alive error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
