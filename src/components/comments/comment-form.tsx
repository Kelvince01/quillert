import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/use-user';
import Tiptap from '../ui/tiptap';

const formSchema = z.object({
    content: z.string().min(1, {
        message: 'Comment cannot be empty.'
    })
});

type CommentFormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
    postId: string;
    parentId?: string;
    onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
    const supabase = createClient();
    const { user } = useUser();
    const { toast } = useToast();

    const form = useForm<CommentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ''
        }
    });

    async function onSubmit(values: CommentFormValues) {
        if (!user) {
            toast({
                title: 'Authentication required',
                description: 'You must be logged in to post a comment.',
                variant: 'destructive'
            });
            return;
        }

        try {
            const { data, error } = await supabase.from('comments').insert([
                {
                    user_id: user.id,
                    post_id: postId,
                    parent_id: parentId || null,
                    content: values.content
                }
            ]);

            if (error) throw error;

            toast({
                title: 'Comment submitted',
                description: 'Your comment has been successfully posted.'
            });

            form.reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error submitting comment:', error);
            toast({
                title: 'Error',
                description: 'There was an error posting your comment. Please try again.',
                variant: 'destructive'
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your comment</FormLabel>
                            <FormControl>
                                {/*<Textarea*/}
                                {/*    placeholder="Write your comment here..."*/}
                                {/*    className="resize-none"*/}
                                {/*    {...field}*/}
                                {/*/>*/}
                                <Tiptap initialValue={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Post Comment</Button>
            </form>
        </Form>
    );
}
