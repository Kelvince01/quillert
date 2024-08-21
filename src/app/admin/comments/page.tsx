import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CommentTable } from '@/components/admin/comments/comment-table';
import { columns } from '@/components/admin/comments/columns';
import { createClient } from '@/utils/supabase/server';
import { Comment } from '@/lib/blog.d';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Comments', link: '/admin/comments' }
];

type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default async function CommentsPage({ searchParams }: paramsProps) {
    const page = Number(searchParams.page) || 1;
    const pageLimit = Number(searchParams.limit) || 10;
    const content = searchParams.search || null;
    const offset = (page - 1) * pageLimit;
    const supabase = createClient();
    const searchTerm = content ? `${content}` : '';
    const from = offset;
    const to = from + pageLimit;

    const { data, count, error } = await supabase
        .from('comments')
        .select(`*, posts(id,title)`, { count: 'exact' })
        .limit(pageLimit)
        .range(from, to)
        .ilike('content', `%${searchTerm}%`)
        .order('created_at', { ascending: true });
    if (error) throw error;
    const commentRes = data;
    const totalComments = count; //1000
    const pageCount = Math.ceil(totalComments / pageLimit);
    const comment: Comment[] = commentRes;
    return (
        <>
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`Comments (${totalComments})`} description="Manage comments" />
                </div>
                <Separator />

                <CommentTable
                    searchKey="content"
                    pageNo={page}
                    columns={columns}
                    totalPosts={totalComments}
                    data={comment}
                    pageCount={pageCount}
                />
            </div>
        </>
    );
}
