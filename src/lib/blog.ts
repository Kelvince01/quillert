// Description: Supabase API functions
// Used to fetch data from a Supabase using the Supabase JS Client
// Types are imported from `blog.d.ts`

import { Post, Category, Tag, Page, Author, FeaturedMedia } from './blog.d';
import { createClient } from '@/utils/supabase/client';

// Supabase Config
const supabase = createClient();

// WordPress Functions
export async function getAllPosts(filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
}): Promise<Post[]> {
    let query = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*');

    // Build query based on filter parameters
    if (filterParams) {
        if (filterParams.author) {
            query = query.eq('author', filterParams.author);
        }
        if (filterParams.tag) {
            // Assuming you have a 'tags' table with a 'post_id' foreign key
            query = query
                .join('tags', 'tags.article_id', '=', 'posts.id')
                .eq('tags.name', filterParams.tag);
        }
        if (filterParams.category) {
            // Assuming you have a 'categories' table with a 'post_id' foreign key
            query = query
                .join('categories', 'categories.article_id', '=', 'posts.id')
                .eq('categories.name', filterParams.category);
        }
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no data found
}

export async function getPostById(id: number): Promise<Post> {
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function getPostBySlug(slug: string): Promise<Post> {
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no post found
}

export async function getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories') // Replace 'categories' with your actual table name
        .select('*');

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no categories found
}

export async function getCategoryById(id: number): Promise<Category> {
    const { data, error } = await supabase
        .from('categories') // Replace 'categories' with your actual table name
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no category found
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
    const { data, error } = await supabase
        .from('categories') // Replace 'categories' with your actual table name
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no category found
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
    // Assuming a 'post_category' table with foreign keys
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .join(
            'post_category', // Replace 'post_category' with your actual table name
            'post_category.post_id',
            '=',
            'posts.id'
        )
        .eq('post_category.category_id', categoryId);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no posts found
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
    // Assuming a 'post_tag' table with foreign keys
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .join(
            'post_tag', // Replace 'post_tag' with your actual table name
            'post_tag.post_id',
            '=',
            'posts.id'
        )
        .eq('post_tag.tag_id', tagId);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no posts found
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
    // Assuming a 'post_tag' table with foreign keys
    const { data, error } = await supabase
        .from('tags') // Replace 'tags' with your actual table name
        .select('*')
        .join(
            'post_tag', // Replace 'post_tag' with your actual table name
            'post_tag.tag_id',
            '=',
            'tags.id'
        )
        .eq('post_tag.post_id', postId);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no tags found
}

export async function getAllTags(): Promise<Tag[]> {
    const { data, error } = await supabase
        .from('tags') // Replace 'tags' with your actual table name
        .select('*');

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no tags found
}

export async function getTagById(id: number): Promise<Tag> {
    const { data, error } = await supabase
        .from('tags') // Replace 'tags' with your actual table name
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no tag found
}

export async function getTagBySlug(slug: string): Promise<Tag> {
    const { data, error } = await supabase
        .from('tags') // Replace 'tags' with your actual table name
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no tag found
}

export async function getAllPages(): Promise<Page[]> {
    const { data, error } = await supabase.from('pages').select('*');

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no pages found
}

/*async function getAllPagesV2(): Promise<Page[]> {
    const pages = await getAllPosts({ pageType: 'page' }); // Assuming 'pageType' column
    return pages;
}*/

export async function getPageById(id: number): Promise<Page> {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no page found
}

export async function getPageBySlug(slug: string): Promise<Page> {
    const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no page found
}

export async function getAllAuthors(): Promise<Author[]> {
    const { data, error } = await supabase.from('authors').select('*');

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no authors found
}

export async function getAuthorById(id: number): Promise<Author> {
    const { data, error } = await supabase.from('authors').select('*').eq('id', id).single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no user found
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
    const { data, error } = await supabase.from('authors').select('*').eq('slug', slug).single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no user found
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
    const { data, error } = await supabase.from('posts').select('*').eq('author_id', authorId);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no posts found
}

export async function getPostsByAuthorSlug(authorSlug: string): Promise<Post[]> {
    const author = await getAuthorBySlug(authorSlug);
    // Assuming a 'post_author' table with foreign keys
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .join(
            'post_author', // Replace 'post_author' with your actual table name
            'post_author.post_id',
            '=',
            'posts.id'
        )
        .eq('post_author.author_id', author.id);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no posts found
}

export async function getPostsByCategorySlug(categorySlug: string): Promise<Post[]> {
    const category = await getCategoryBySlug(categorySlug);
    // Assuming a 'post_category' table with foreign keys
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .join(
            'post_category', // Replace 'post_category' with your actual table name
            'post_category.post_id',
            '=',
            'posts.id'
        )
        .eq('post_category.category_id', category.id);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no posts found
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
    const tag = await getTagBySlug(tagSlug);
    // const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id });

    // Assuming a 'post_tag' table with foreign keys
    const { data, error } = await supabase
        .from('posts') // Replace 'posts' with your actual table name
        .select('*')
        .join(
            'post_tag', // Replace 'post_tag' with your actual table name
            'post_tag.post_id',
            '=',
            'posts.id'
        )
        .eq('post_tag.tag_id', tag.id);

    if (error) {
        throw error;
    }

    return data || []; // Return empty array if no posts found
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
    const { data, error } = await supabase
        .from('media') // Replace 'media' with your actual table name
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw error;
    }

    return data || null; // Return null if no media found
}
