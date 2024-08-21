'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';
import { Tag } from '@/lib/blog.d';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function TagInsertDialog() {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<Tag>();
    const supabase = createClient();
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data: Tag) => {
        const { data: insertedData, error } = await supabase.from('tags').insert([
            {
                name: data.name,
                slug: data.slug,
                description: data.description
            }
        ]);

        if (error) {
            // console.error('Error inserting tag:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Tag creation failed'
            });
        } else {
            // console.log('Tag inserted:', insertedData);
            toast({
                title: 'Success',
                description: 'Tag created successfully.'
            });
            setOpen(false);
            router.refresh();
        }
    };

    // Generate slug from name
    const name = watch('name');
    useEffect(() => {
        if (name) {
            setValue('slug', name.toLowerCase().replace(/ /g, '-'));
        }
    }, [name, setValue]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Tag</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Tag</DialogTitle>
                    <DialogDescription>Label to attach to post</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Tag Name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            placeholder="Slug"
                            {...register('slug', { required: 'Slug is required' })}
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-sm">{errors.slug.message}</p>
                        )}
                    </div>
                    <div>
                        <Textarea placeholder="Description" {...register('description')} />
                    </div>

                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
