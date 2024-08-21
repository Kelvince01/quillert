import { Breadcrumbs } from '@/components/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PostTable } from '@/components/admin/posts/post-table';
import { columns } from '@/components/admin/posts/columns';
import { createClient } from '@/utils/supabase/server';
import { Post } from '@/lib/blog.d';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Posts', link: '/admin/posts' }
];

type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default async function PostsPage({ searchParams }: paramsProps) {
    const page = Number(searchParams.page) || 1;
    const pageLimit = Number(searchParams.limit) || 10;
    const title = searchParams.search || null;
    const offset = (page - 1) * pageLimit;
    const supabase = createClient();
    const searchTerm = title ? `${title}` : '';
    const from = offset;
    const to = from + pageLimit;

    const { data, count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .limit(pageLimit)
        .range(from, to)
        .ilike('title', `%${searchTerm}%`)
        .order('created_at', { ascending: true });
    if (error) throw error;
    const postRes = data;
    const totalPosts = count; //1000
    const pageCount = Math.ceil(totalPosts / pageLimit);
    const post: Post[] = postRes;
    return (
        <>
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`Posts (${totalPosts})`} description="Manage posts" />

                    <Link
                        href={'/admin/posts/new'}
                        className={cn(buttonVariants({ variant: 'default' }))}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Link>
                </div>
                <Separator />

                <PostTable
                    searchKey="title"
                    pageNo={page}
                    columns={columns}
                    totalPosts={totalPosts}
                    data={post}
                    pageCount={pageCount}
                />
            </div>
        </>
    );
}
