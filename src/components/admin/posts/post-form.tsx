'use client';

import * as z from 'zod';
import React, { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
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
import {
    MultiSelector,
    MultiSelectorTrigger,
    MultiSelectorInput,
    MultiSelectorContent,
    MultiSelectorList,
    MultiSelectorItem
} from '@/components/ui/extensions/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/file-upload';
import { useToast } from '@/components/ui/use-toast';
import { Editor } from '@tinymce/tinymce-react';
import { Tag, TagInput } from '@/components/ui/tag/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/utils/slugify';
import { ARTICLES_STATUSES } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { Category, Tag as PostTag } from '@/lib/blog.d';

const ImgSchema = z.object({
    fileName: z.string(),
    name: z.string(),
    fileSize: z.number(),
    size: z.number(),
    fileKey: z.string(),
    key: z.string(),
    fileUrl: z.string(),
    url: z.string()
});

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
    title: z.string().min(3, { message: 'Post Name must be at least 3 characters' }),
    slug: z.string().min(3, { message: 'Post Name must be at least 3 characters' }),
    content: z.string().min(3, { message: 'Post content must be at least 3 characters' }),
    image: z
        .array(ImgSchema)
        .max(IMG_MAX_LIMIT, { message: 'You can only add up to 3 images' })
        .min(1, { message: 'At least one image must be added.' }),
    excerpt: z.string().min(3, { message: 'Post description must be at least 3 characters' }),
    // price: z.coerce.number(),
    status: z.string(),
    category: z.string().min(1, { message: 'Please select a category' }),
    tags: z.array(
        z.object({
            id: z.string(),
            title: z.string()
        })
    ),
    categories: z.array(z.string())
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
    initialData: any | null;
    categories: Category[];
    postTags: PostTag[];
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, categories, postTags }) => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const title = initialData ? 'Edit post' : 'Create post';
    const description = initialData ? 'Edit a post.' : 'Add a new post';
    const toastMessage = initialData ? 'Post updated.' : 'Post created.';
    const action = initialData ? 'Save changes' : 'Create';

    const defaultValues = initialData
        ? initialData
        : {
              title: '',
              excerpt: '',
              image: [],
              category: ''
          };

    const form = useForm<PostFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const { setValue } = form;
    const [tags, setTags] = React.useState<Tag[]>([]);
    // const [value, setValue] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const supabase = createClient();

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log((editorRef.current as any).getContent());
        }
    };

    async function uploadImage(file: any) {
        const { data, error } = await supabase.storage
            .from('post_images')
            .upload('path/to/your/image.jpg', file);

        if (error) {
            console.error('Error uploading image:', error);
        } else {
            const imageUrl = data.path;
            console.log('Image uploaded successfully!', imageUrl);
            // Use the imageUrl to set the image on Next.js component
            setImageUrl(imageUrl); // Assuming you have a state variable for imageUrl
        }
    }

    const handleUpload = async (event: any) => {
        const file = event.target.files[0];
        await uploadImage(file);
    };

    const onSubmit = async (data: PostFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // await axios.post(`/api/products/edit-post/${initialData._id}`, data);
            } else {
                let newData = {
                    guid: crypto.randomUUID()
                };

                // const res = await axios.post(`/api/products/create-post`, data);
                // console.log("post", res);
            }
            router.refresh();
            router.push(`/admin/posts`);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.'
            });
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
            //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
        } catch (error: any) {
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const triggerImgUrlValidation = () => form.trigger('image');

    return (
        <>
            {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
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
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        onChange={field.onChange}
                                        value={field.value}
                                        onRemove={field.onChange}
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
                                        onChange={(e) => {
                                            setValue('title', e.target.value);
                                            setValue('slug', slugify(e.target.value));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="slug"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Article slug" />
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
                                        {...field}
                                        init={{
                                            height: 500,
                                            menubar: false,
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
                                                'wordcount'
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
                                    <FormControl>
                                        <TagInput
                                            {...field}
                                            placeholder="Enter a tag"
                                            tags={tags}
                                            className="sm:min-w-[450px]"
                                            setTags={(newTags) => {
                                                setTags(newTags);
                                                setValue('tags', newTags as [Tag, ...Tag[]]);
                                            }}
                                        />
                                    </FormControl>
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
                                    <FormControl>
                                        {/*<MultiSelector*/}
                                        {/*    values={field.value}*/}
                                        {/*    onValuesChange={field.onChange}*/}
                                        {/*    loop={false}*/}
                                        {/*>*/}
                                        {/*    <MultiSelectorTrigger>*/}
                                        {/*        <MultiSelectorInput placeholder="Select your framework" />*/}
                                        {/*    </MultiSelectorTrigger>*/}
                                        {/*    <MultiSelectorContent>*/}
                                        {/*        <MultiSelectorList>*/}
                                        {/*            {categories.map((option, i) => (*/}
                                        {/*                <MultiSelectorItem*/}
                                        {/*                    key={i}*/}
                                        {/*                    value={String(option.id)}*/}
                                        {/*                >*/}
                                        {/*                    {option.name}*/}
                                        {/*                </MultiSelectorItem>*/}
                                        {/*            ))}*/}
                                        {/*        </MultiSelectorList>*/}
                                        {/*    </MultiSelectorContent>*/}
                                        {/*</MultiSelector>*/}
                                    </FormControl>
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
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a category"
                                                />
                                            </SelectTrigger>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};
