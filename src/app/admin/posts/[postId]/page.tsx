import { Breadcrumbs } from '@/components/breadcrumbs';
import { PostForm } from '@/components/admin/posts/post-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { getAllCategories, getAllTags, getPostById } from '@/lib/blog';
import { Post } from '@/lib/blog.d';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Posts', link: '/admin/posts' },
    { title: 'Create', link: '/admin/posts/new' }
];

export default async function Page({ params }: { params: { postId: string } }) {
    let categories = await getAllCategories();
    let tags = await getAllTags();
    let initialData: Post | null = null;

    if (!isNaN(parseInt(params.postId)) && params.postId !== 'new') {
        initialData = await getPostById(parseInt(params.postId));
    }

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-8">
                <Breadcrumbs items={breadcrumbItems} />
                <PostForm
                    categories={categories}
                    postTags={tags}
                    initialData={initialData}
                    key={null}
                />
            </div>
        </ScrollArea>
    );
}
