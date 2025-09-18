'use client';

import { useState, useEffect, useCallback } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/lib/blog.d';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function CategoryInsertDialog() {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<Category>();
    const supabase = createClient();
    const { toast } = useToast();
    const router = useRouter();

    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase.from('categories').select('id, name');
        if (error) console.error('Error fetching categories:', error);
        else setCategories(data);
    }, [supabase]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const onSubmit = async (data: Category) => {
        const { data: insertedData, error } = await supabase.from('categories').insert([
            {
                name: data.name,
                slug: data.slug,
                description: data.description,
                parent: data.parent || null
            }
        ]);

        if (error) {
            // console.error('Error inserting category:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Category creation failed'
            });
        } else {
            // console.log('Category inserted:', insertedData);
            toast({
                title: 'Success',
                description: 'Category created successfully.'
            });
            setOpen(false);
            // Optionally, refresh the categories list
            fetchCategories();
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
                <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Posts categorization</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Category Name"
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
                    <div>
                        <Select onValueChange={(value) => setValue('parent', Number(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id!.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
