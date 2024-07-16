import { Breadcrumbs } from '@/components/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/constants/data';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PostTable } from '@/components/admin/posts/post-table';
import { columns } from '@/components/admin/posts/columns';

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
    const country = searchParams.search || null;
    const offset = (page - 1) * pageLimit;

    const res = await fetch(
        `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
            (country ? `&search=${country}` : '')
    );
    const postRes = await res.json();
    const totalUsers = postRes.total_users; //1000
    const pageCount = Math.ceil(totalUsers / pageLimit);
    const post: Employee[] = postRes.users;
    return (
        <>
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`Posts (${totalUsers})`} description="Manage posts" />

                    <Link
                        href={'/admin/posts/new'}
                        className={cn(buttonVariants({ variant: 'default' }))}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Link>
                </div>
                <Separator />

                <PostTable
                    searchKey="country"
                    pageNo={page}
                    columns={columns}
                    totalUsers={totalUsers}
                    data={post}
                    pageCount={pageCount}
                />
            </div>
        </>
    );
}
