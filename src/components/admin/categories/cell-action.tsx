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
import { Category } from '@/lib/blog.d';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CellActionProps {
    data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const categoryId = data.id;
    const { toast } = useToast();

    const onConfirm = async () => {
        const { error } = await supabase.from('categories').delete().eq('id', categoryId);
        if (error) {
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Category deletion failed'
            });
        }
        toast({
            title: 'Success',
            description: 'Category deleted successfully'
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
                    <DropdownMenuItem
                        onClick={() => router.push(`/admin/categories/${categoryId}`)}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
