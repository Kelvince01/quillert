'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Comment } from '@/lib/blog.d';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { CommentApproval } from '@/components/comments/approve-comment';

interface CellActionProps {
    data: Comment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const commentId = data.id;
    const { toast } = useToast();

    const onConfirm = async () => {
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (error) {
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Comment deletion failed'
            });
        }
        toast({
            title: 'Success',
            description: 'Comment deleted successfully'
        });
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem>
                        <CommentApproval comment={data} />
                    </DropdownMenuItem>
                    {/*<DropdownMenuItem onClick={() => router.push(`/admin/comments/${commentId}`)}>*/}
                    {/*    <Edit className="mr-2 h-4 w-4" /> Update*/}
                    {/*</DropdownMenuItem>*/}
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
