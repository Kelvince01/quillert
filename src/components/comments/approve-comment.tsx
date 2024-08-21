'use client';

import { useUser } from '@/hooks/use-user';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Comment } from '@/lib/blog.d';
import { CircleCheckBig } from 'lucide-react';

export function CommentApproval({ comment }: { comment: Comment }) {
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

    return (
        <div>
            {!isApproved && (
                <button onClick={handleApprove} className="flex flex-row">
                    <CircleCheckBig className="mr-2 h-4 w-4" /> Approve
                </button>
            )}
        </div>
    );
}
