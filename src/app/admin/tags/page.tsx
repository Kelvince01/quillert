import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TagTable } from '@/components/admin/tags/tag-table';
import { columns } from '@/components/admin/tags/columns';
import { createClient } from '@/utils/supabase/server';
import { Tag } from '@/lib/blog.d';
import { TagInsertDialog } from '@/components/modal/create-tag-modal';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Tags', link: '/admin/tags' }
];

type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default async function TagsPage({ searchParams }: paramsProps) {
    const page = Number(searchParams.page) || 1;
    const pageLimit = Number(searchParams.limit) || 10;
    const content = searchParams.search || null;
    const offset = (page - 1) * pageLimit;
    const supabase = createClient();
    const searchTerm = content ? `${content}` : '';
    const from = offset;
    const to = from + pageLimit;

    const { data, count, error } = await supabase
        .from('tags')
        .select(`*`, { count: 'exact' })
        .limit(pageLimit)
        .range(from, to)
        .ilike('name', `%${searchTerm}%`)
        .order('id', { ascending: true });
    if (error) throw error;
    const tagRes = data;
    const totalTags = count; //1000
    const pageCount = Math.ceil(totalTags / pageLimit);
    const tag: Tag[] = tagRes;
    return (
        <>
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`Tags (${totalTags})`} description="Manage tags" />
                    <TagInsertDialog />
                </div>
                <Separator />

                <TagTable
                    searchKey="name"
                    pageNo={page}
                    columns={columns}
                    totalPosts={totalTags}
                    data={tag}
                    pageCount={pageCount}
                />
            </div>
        </>
    );
}
