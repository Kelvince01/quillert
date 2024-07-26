'use client';

import { useUser } from '@/hooks/use-user';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export function CommentApproval({
    comment
}: {
    comment: { id: number; content: string; approved: boolean };
}) {
    const [isApproved, setIsApproved] = useState(comment.approved);
    const user = useUser();
    const supabase = createClient();

    const handleApprove = async () => {
        if (!user) {
            console.error('User must be authenticated to approve comments');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('comments')
                .update({ approved: true })
                .eq('id', comment.id);

            if (error) throw error;

            setIsApproved(true);
        } catch (error) {
            console.error('Error approving comment:', error);
        }
    };

    if (!user) return null;

    return <div>{!isApproved && <button onClick={handleApprove}>Approve Comment</button>}</div>;
}
