import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { postId } = await request.json();
    const supabase = createClient();

    if (!postId || typeof postId !== 'number') {
        return NextResponse.json({ error: 'Valid post ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase.rpc('increment_views', { post_id: postId });

        if (error) throw error;

        return NextResponse.json({ success: true, views: data });
    } catch (error) {
        console.error('Error incrementing view:', error);
        return NextResponse.json({ error: 'Failed to increment view' }, { status: 500 });
    }
}
