import { Breadcrumbs } from '@/components/breadcrumbs';
import { PostForm } from '@/components/admin/posts/post-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { getAllCategories, getAllTags } from '@/lib/blog';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Posts', link: '/admin/posts' },
    { title: 'Create', link: '/admin/posts/create' }
];

export default async function Page() {
    let categories = await getAllCategories();
    let tags = await getAllTags();

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-8">
                <Breadcrumbs items={breadcrumbItems} />
                <PostForm categories={categories} postTags={tags} initialData={null} key={null} />
            </div>
        </ScrollArea>
    );
}
