import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoryTable } from '@/components/admin/categories/category-table';
import { columns } from '@/components/admin/categories/columns';
import { createClient } from '@/utils/supabase/server';
import { Category } from '@/lib/blog.d';
import { CategoryInsertDialog } from '@/components/modal/create-category-modal';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Categories', link: '/admin/categories' }
];

type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default async function CategoriesPage({ searchParams }: paramsProps) {
    const page = Number(searchParams.page) || 1;
    const pageLimit = Number(searchParams.limit) || 10;
    const content = searchParams.search || null;
    const offset = (page - 1) * pageLimit;
    const supabase = createClient();
    const searchTerm = content ? `${content}` : '';
    const from = offset;
    const to = from + pageLimit;

    const { data, count, error } = await supabase
        .from('categories')
        .select(`*, categories(id,name)`, { count: 'exact' })
        .limit(pageLimit)
        .range(from, to)
        .ilike('name', `%${searchTerm}%`)
        .order('id', { ascending: true });
    if (error) throw error;
    const categoryRes = data;
    const totalCategories = count; //1000
    const pageCount = Math.ceil(totalCategories / pageLimit);
    const category: Category[] = categoryRes;
    return (
        <>
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading
                        title={`Categories (${totalCategories})`}
                        description="Manage categories"
                    />
                    <CategoryInsertDialog />
                </div>
                <Separator />

                <CategoryTable
                    searchKey="name"
                    pageNo={page}
                    columns={columns}
                    totalPosts={totalCategories}
                    data={category}
                    pageCount={pageCount}
                />
            </div>
        </>
    );
}
