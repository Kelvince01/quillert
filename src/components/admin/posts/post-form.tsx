'use client';

import * as z from 'zod';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Editor } from '@tinymce/tinymce-react';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/utils/slugify';
import { ARTICLES_STATUSES } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { Post, Author, Category, FeaturedMedia, Tag } from '@/lib/blog.d';
import { AlertModal } from '@/components/modal/alert-modal';
import Link from 'next/link';
import { getAuthorByUserId, getFeaturedMediaById } from '@/lib/blog';
import { CategoryInsertDialog } from '@/components/modal/create-category-modal';
import FeaturedImageUpload from '@/components/admin/posts/featured-image-upload';
import { TagInsertDialog } from '@/components/modal/create-tag-modal';
import { urlToFile, getRandomInt } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';

const formSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(3, { message: 'Post Name must be at least 3 characters' }),
    content: z.string().min(3, { message: 'Post content must be at least 3 characters' }),
    image: z
        .array(
            z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
                message: 'File size must be less than 4MB'
            })
        )
        .max(1, {
            message: 'Maximum 1 file is allowed'
        }),
    excerpt: z.string().min(3, { message: 'Post description must be at least 3 characters' }),
    status: z.string(),
    tags: z.string().min(1, { message: 'Please select a tag' }),
    categories: z.string().min(1, { message: 'Please select a category' }),
    sticky: z.boolean().default(false).optional()
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
    initialData: Post | null;
    categories: Category[];
    postTags: Tag[];
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, categories, postTags }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [featuredMedia, setFeaturedMedia] = useState<FeaturedMedia | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const supabase = createClient();
    const editorRef = useRef(null);

    const formConfig = {
        title: initialData ? 'Edit post' : 'Create post',
        description: initialData ? 'Edit a post.' : 'Add a new post',
        toastMessage: initialData ? 'Post updated.' : 'Post created.',
        action: initialData ? 'Save changes' : 'Create'
    };

    const fetchMediaData = useCallback(
        async (mediaId: number) => {
            try {
                const media = await getFeaturedMediaById(mediaId);
                setFeaturedMedia(media);
                if (media?.source_url) {
                    const file = await urlToFile(media.source_url, media.title);
                    setImage(file);
                    return file;
                }
            } catch (error) {
                console.error('Error fetching media data:', error);
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: 'Error fetching image data.'
                });
            }
            return null;
        },
        [toast]
    );

    useEffect(() => {
        async function getUser() {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            setUser(user);
        }

        getUser();
    });

    useEffect(() => {
        const initForm = async () => {
            if (user?.id) {
                const currentAuthor = await getAuthorByUserId(user.id);
                setAuthor(currentAuthor);
            }

            if (initialData?.featured_media) {
                await fetchMediaData(initialData.featured_media);
            }
        };

        initForm();
    }, [user, initialData, fetchMediaData]);

    const form = useForm<PostFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: async () => {
            if (initialData) {
                let imageFile: File | null = null;
                if (initialData.featured_media) {
                    imageFile = await fetchMediaData(initialData.featured_media);
                }
                return {
                    id: initialData.id,
                    categories: String(initialData.categories?.[0]),
                    content: initialData.content ?? '',
                    image: imageFile ? [imageFile] : [],
                    status: initialData.status ?? '',
                    tags: String(initialData.tags?.[0]),
                    title: initialData.title ?? '',
                    excerpt: initialData.excerpt ?? '',
                    sticky: initialData.sticky ?? false
                };
            }
            return {
                title: '',
                excerpt: '',
                content: '',
                image: [],
                status: '',
                tags: '',
                categories: '',
                sticky: false
            };
        }
    });
    const { setValue } = form;

    if (initialData?.content) {
        if (editorRef.current) {
            (editorRef.current as any).setContent(initialData.content);
        }
    }

    const log = () => {
        if (editorRef.current) {
            // console.log((editorRef.current as any).getContent());
        }
    };

    const handleUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}-${getRandomInt(1, 1000)}.${fileExt}`;
        try {
            console.log(filePath);
            const { error } = await supabase.storage
                .from('featured_images')
                .upload(`public/${filePath}`, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            console.log('filePath');

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
                .from('featured_images')
                .getPublicUrl(`${filePath}`);

            setImageUrl(publicUrlData.publicUrl);
            console.log(publicUrlData.publicUrl);
            console.log(imageUrl);
            toast({
                title: 'Success',
                description: 'Image uploaded successfully.'
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Error uploading image.'
            });
        }
    };

    async function createFeaturedImage(filePath: string, altText: string, slugText: string) {
        const fMedia = {
            date: new Date().toISOString(),
            slug: slugText,
            type: 'Image',
            link: filePath,
            title: altText,
            author: author?.id!,
            caption: altText,
            alt_text: altText,
            source_url: filePath
        };
        // console.log(fMedia);

        // try {
        const { data, error } = await supabase.from('media').insert([fMedia]);
        if (error) throw error;
        console.log(data);
        setFeaturedMedia(data);
        toast({
            title: 'Success',
            description: 'Featured Image created successfully.'
        });
        // } catch (error) {
        //     toast({
        //         variant: 'destructive',
        //         title: 'Uh oh! Something went wrong.',
        //         description: 'There was a problem creating featured media.'
        //     });
        // }
    }

    const onSubmit = async (data: PostFormValues) => {
        try {
            setLoading(true);
            const slug = slugify(data.title);
            const imgUrl =
                'https://hzmdqhzfvhihhvjxzxzu.supabase.co/storage/v1/object/public/post_images/a08345_fe381f44f24540a1b0ed3b530d054dad_mv2.webp';

            const commonData = {
                title: data.title,
                slug,
                content: data.content,
                excerpt: data.excerpt,
                status: data.status,
                link: `https://quillert.com/posts/${slug}`,
                author: author?.id!,
                sticky: data.sticky,
                categories: [Number(data.categories)],
                tags: [Number(data.tags)]
            };

            if (initialData) {
                if (data.image && data.image.length > 0) {
                    // await handleUpload(data.image);
                    await createFeaturedImage(imgUrl, data.title, slug);
                    (commonData as Post).featured_media = featuredMedia?.id!;
                }

                const { error } = await supabase
                    .from('posts')
                    .update(commonData)
                    .eq('id', initialData.id);
                if (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: 'There was a problem updating the post.'
                    });
                }
            } else {
                if (data.image && data.image.length > 0) {
                    // await handleUpload(data.image);
                    // await createFeaturedImage(imgUrl, data.title, slug);
                }
                // const fMedia: FeaturedMedia = {
                //     slug: slug,
                //     link: imgUrl,
                //     title: data.title,
                //     author: author?.id!,
                //     caption: data.title,
                //     alt_text: data.title,
                //     source_url: imgUrl
                // };
                // console.log(fMedia);
                // console.log('pass data 2');

                // const { data: fData, error: fError } = await supabase
                //     .from('media')
                //     .insert([fMedia])
                //     .select();
                // if (fError) throw fError;
                // console.log(fData);
                // setFeaturedMedia(fData);
                // toast({
                //     title: 'Success',
                //     description: 'Featured Image created successfully.'
                // });

                let newData = {
                    ...commonData,
                    guid: crypto.randomUUID(),
                    featured_media: 3 //featuredMedia?.id
                };
                console.log(newData);

                const { error } = await supabase.from('posts').insert(newData);
                if (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: 'There was a problem creating the post.'
                    });
                }
            }
            toast({
                title: 'Success',
                description: formConfig.toastMessage
            });
            router.refresh();
            router.push(`/admin/posts`);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.'
            });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            if (!initialData?.id) throw new Error('No post ID to delete');
            const { error } = await supabase.from('posts').delete().eq('id', initialData?.id!);
            if (error) {
                toast({
                    variant: 'destructive',
                    title: 'Failed',
                    description: 'Post deletion failed'
                });
            }
            toast({
                title: 'Success',
                description: 'Post deleted successfully'
            });
            router.refresh();
            router.push(`/admin/posts`);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.'
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={formConfig.title} description={formConfig.description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Featured Image</FormLabel>
                                <FormControl>
                                    <FeaturedImageUpload
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        {...field}
                                        placeholder="Article title"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Excerpt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={loading}
                                        {...field}
                                        placeholder="Write your article excerpt"
                                        rows={8}
                                        cols={50}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Editor
                                        apiKey="9dcjeahsyi9nnq4blyxhs1dmu51lxwkz0nw6f6wqsz6rq7en"
                                        onInit={(_evt, editor) =>
                                            ((editorRef.current as any) = editor)
                                        }
                                        initialValue="<p>Type your blog content...</p>"
                                        disabled={loading}
                                        // onEditorChange={field.onChange}
                                        onEditorChange={(newValue, editor) => {
                                            setValue('content', newValue, { shouldValidate: true });
                                            log();
                                        }}
                                        init={{
                                            height: 500,
                                            menubar: true,
                                            plugins: [
                                                'advlist',
                                                'autolink',
                                                'lists',
                                                'link',
                                                'image',
                                                'charmap',
                                                'preview',
                                                'anchor',
                                                'searchreplace',
                                                'visualblocks',
                                                'code',
                                                'fullscreen',
                                                'insertdatetime',
                                                'media',
                                                'table',
                                                'code',
                                                'help',
                                                'wordcount',
                                                'fullscreen'
                                                // 'advcode'
                                            ],
                                            toolbar:
                                                'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'code | ' +
                                                'removeformat | help',
                                            content_style:
                                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="gap-8 md:grid md:grid-cols-2">
                        <FormField
                            name="tags"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel className="text-left">Tags</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <div className="flex flex-row space-x-2 w-[100%]">
                                                <SelectTrigger>
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a tag"
                                                    />
                                                </SelectTrigger>
                                                <TagInsertDialog />
                                            </div>
                                        </FormControl>
                                        <SelectContent>
                                            {postTags.map((tag) => (
                                                <SelectItem key={tag.id} value={String(tag.id)}>
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        These are the tags that this article falls in.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="categories"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel className="text-left">Categories</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <div className="flex flex-row space-x-2 w-[100%]">
                                                <SelectTrigger className="w-[70%]">
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a category"
                                                    />
                                                </SelectTrigger>
                                                <CategoryInsertDialog />
                                            </div>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        These are the tags that this article falls in.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="gap-8 md:grid md:grid-cols-2">
                        <FormField
                            name="status"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a status"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ARTICLES_STATUSES.map((type) => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sticky"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-2 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Set this post as the featured post</FormLabel>
                                        <FormDescription>
                                            Usually displayed on home page after the hero{' '}
                                            <Link href="/">featured post</Link>.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {formConfig.action}
                    </Button>
                </form>
            </Form>
        </>
    );
};
