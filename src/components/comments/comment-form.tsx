'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';

interface CommentFormData {
    id: string;
    name: string;
    email: string;
    comment: string;
}

interface CommentFormProps {
    id: string;
}

const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    name: z.string().min(1, { message: 'Name is required' }),
    comment: z.string().min(1, { message: 'Comment is required' })
});

type UserFormValue = z.infer<typeof formSchema>;

export function CommentForm({ id }: CommentFormProps): React.JSX.Element {
    const [formData, setFormData] = useState<UserFormValue | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);
    const defaultValues = {
        email: ''
    };
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const supabase = createClient();
    const { toast } = useToast();

    const onSubmit = async (data: UserFormValue) => {
        setIsSubmitting(true);
        setFormData(data);
        try {
            const response = await fetch('/api/createComment', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            setIsSubmitting(false);
            setHasSubmitted(true);
        } catch (err) {
            setFormData(null);
            console.error(err);
        }
    };

    if (isSubmitting) {
        return <h3>Submitting comment…</h3>;
    }

    if (hasSubmitted) {
        return (
            <>
                <h3>Thanks for your comment!</h3>
                <ul>
                    <li>
                        Name: {formData?.name} <br />
                        Email: {formData?.email} <br />
                        Comment: {formData?.comment}
                    </li>
                </ul>
            </>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg">
                {/*<input {...register('id')} type="hidden" value={id} />*/}
                {/*<label className="block mb-5">*/}
                {/*    <span className="text-gray-700">Name</span>*/}
                {/*    <input*/}
                {/*        {...register('name', { required: true })}*/}
                {/*        className="form-input mt-1 block w-full"*/}
                {/*        placeholder="John Appleseed"*/}
                {/*    />*/}
                {/*</label>*/}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    disabled={loading}
                                    required
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*<label className="block mb-5">*/}
                {/*    <span className="text-gray-700">Email</span>*/}
                {/*    <input*/}
                {/*        {...register('email', { required: true })}*/}
                {/*        type="email"*/}
                {/*        className="form-input mt-1 block w-full"*/}
                {/*        placeholder="your@email.com"*/}
                {/*    />*/}
                {/*</label>*/}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="m@example.com"
                                    disabled={loading}
                                    required
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/*<label className="block mb-5">*/}
                {/*    <span className="text-gray-700">Comment</span>*/}
                {/*    <textarea*/}
                {/*        {...register('comment', { required: true })}*/}
                {/*        className="form-textarea mt-1 block w-full"*/}
                {/*        rows={8}*/}
                {/*        placeholder="Enter some long form content."*/}
                {/*    ></textarea>*/}
                {/*</label>*/}
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type in your comment"
                                    disabled={loading}
                                    required
                                    {...field}
                                ></Textarea>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" aria-disabled={loading} className="w-full mt-4 mb-4">
                    {loading ? 'Submitting comment...' : 'Comment'}
                </Button>
            </form>
        </Form>
    );
}
