export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            author_avatars: {
                Row: {
                    author: number;
                    size: string;
                    url: string;
                };
                Insert: {
                    author: number;
                    size: string;
                    url: string;
                };
                Update: {
                    author?: number;
                    size?: string;
                    url?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'author_avatars_author_id_fkey';
                        columns: ['author'];
                        isOneToOne: false;
                        referencedRelation: 'authors';
                        referencedColumns: ['id'];
                    }
                ];
            };
            authors: {
                Row: {
                    description: string | null;
                    id: number;
                    link: string | null;
                    meta: Json | null;
                    name: string;
                    slug: string;
                    url: string | null;
                    user_id: string | null;
                };
                Insert: {
                    description?: string | null;
                    id?: never;
                    link?: string | null;
                    meta?: Json | null;
                    name: string;
                    slug: string;
                    url?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    description?: string | null;
                    id?: never;
                    link?: string | null;
                    meta?: Json | null;
                    name?: string;
                    slug?: string;
                    url?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'authors_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    }
                ];
            };
            categories: {
                Row: {
                    count: number | null;
                    description: string | null;
                    id: number;
                    link: string | null;
                    meta: Json | null;
                    name: string;
                    parent: number | null;
                    slug: string;
                    taxonomy: string;
                };
                Insert: {
                    count?: number | null;
                    description?: string | null;
                    id?: never;
                    link?: string | null;
                    meta?: Json | null;
                    name: string;
                    parent?: number | null;
                    slug: string;
                    taxonomy?: string;
                };
                Update: {
                    count?: number | null;
                    description?: string | null;
                    id?: never;
                    link?: string | null;
                    meta?: Json | null;
                    name?: string;
                    parent?: number | null;
                    slug?: string;
                    taxonomy?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'categories_parent_id_fkey';
                        columns: ['parent'];
                        isOneToOne: false;
                        referencedRelation: 'categories';
                        referencedColumns: ['id'];
                    }
                ];
            };
            comments: {
                Row: {
                    approved: boolean;
                    content: string;
                    created_at: string | null;
                    id: string;
                    parent_id: string | null;
                    post_id: number | null;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Insert: {
                    approved?: boolean;
                    content: string;
                    created_at?: string | null;
                    id?: string;
                    parent_id?: string | null;
                    post_id?: number | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    approved?: boolean;
                    content?: string;
                    created_at?: string | null;
                    id?: string;
                    parent_id?: string | null;
                    post_id?: number | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'comments_parent_id_fkey';
                        columns: ['parent_id'];
                        isOneToOne: false;
                        referencedRelation: 'comments';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'comments_post_id_fkey';
                        columns: ['post_id'];
                        isOneToOne: false;
                        referencedRelation: 'posts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'comments_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    }
                ];
            };
            media: {
                Row: {
                    alt_text: string | null;
                    author: number | null;
                    caption: string | null;
                    date: string;
                    id: number;
                    link: string;
                    media_details: Json | null;
                    media_type: string | null;
                    mime_type: string | null;
                    slug: string;
                    source_url: string | null;
                    title: string;
                    type: string;
                };
                Insert: {
                    alt_text?: string | null;
                    author?: number | null;
                    caption?: string | null;
                    date?: string;
                    id?: never;
                    link: string;
                    media_details?: Json | null;
                    media_type?: string | null;
                    mime_type?: string | null;
                    slug: string;
                    source_url?: string | null;
                    title: string;
                    type?: string;
                };
                Update: {
                    alt_text?: string | null;
                    author?: number | null;
                    caption?: string | null;
                    date?: string;
                    id?: never;
                    link?: string;
                    media_details?: Json | null;
                    media_type?: string | null;
                    mime_type?: string | null;
                    slug?: string;
                    source_url?: string | null;
                    title?: string;
                    type?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'media_author_id_fkey';
                        columns: ['author'];
                        isOneToOne: false;
                        referencedRelation: 'authors';
                        referencedColumns: ['id'];
                    }
                ];
            };
            media_details: {
                Row: {
                    file: string | null;
                    height: number | null;
                    media_id: number;
                    source_url: string | null;
                    width: number | null;
                };
                Insert: {
                    file?: string | null;
                    height?: number | null;
                    media_id: number;
                    source_url?: string | null;
                    width?: number | null;
                };
                Update: {
                    file?: string | null;
                    height?: number | null;
                    media_id?: number;
                    source_url?: string | null;
                    width?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'media_details_media_id_fkey';
                        columns: ['media_id'];
                        isOneToOne: true;
                        referencedRelation: 'media';
                        referencedColumns: ['id'];
                    }
                ];
            };
            media_sizes: {
                Row: {
                    file: string | null;
                    height: number | null;
                    media_details_id: number;
                    mime_type: string | null;
                    size: string;
                    source_url: string | null;
                    width: number | null;
                };
                Insert: {
                    file?: string | null;
                    height?: number | null;
                    media_details_id: number;
                    mime_type?: string | null;
                    size: string;
                    source_url?: string | null;
                    width?: number | null;
                };
                Update: {
                    file?: string | null;
                    height?: number | null;
                    media_details_id?: number;
                    mime_type?: string | null;
                    size?: string;
                    source_url?: string | null;
                    width?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'media_sizes_media_details_id_fkey';
                        columns: ['media_details_id'];
                        isOneToOne: false;
                        referencedRelation: 'media_details';
                        referencedColumns: ['media_id'];
                    }
                ];
            };
            pages: {
                Row: {
                    author: number;
                    comment_status: string;
                    content: string;
                    created_at: string | null;
                    date: string;
                    date_gmt: string;
                    excerpt: string;
                    featured_media: number | null;
                    guid: string;
                    id: number;
                    link: string;
                    menu_order: number | null;
                    meta: Json | null;
                    modified: string;
                    modified_gmt: string;
                    parent: number | null;
                    ping_status: string;
                    slug: string;
                    status: string;
                    template: string;
                    title: string;
                    type: string;
                    updated_at: string | null;
                };
                Insert: {
                    author: number;
                    comment_status?: string;
                    content: string;
                    created_at?: string | null;
                    date: string;
                    date_gmt: string;
                    excerpt: string;
                    featured_media?: number | null;
                    guid?: string;
                    id?: never;
                    link: string;
                    menu_order?: number | null;
                    meta?: Json | null;
                    modified: string;
                    modified_gmt: string;
                    parent?: number | null;
                    ping_status?: string;
                    slug: string;
                    status?: string;
                    template?: string;
                    title: string;
                    type?: string;
                    updated_at?: string | null;
                };
                Update: {
                    author?: number;
                    comment_status?: string;
                    content?: string;
                    created_at?: string | null;
                    date?: string;
                    date_gmt?: string;
                    excerpt?: string;
                    featured_media?: number | null;
                    guid?: string;
                    id?: never;
                    link?: string;
                    menu_order?: number | null;
                    meta?: Json | null;
                    modified?: string;
                    modified_gmt?: string;
                    parent?: number | null;
                    ping_status?: string;
                    slug?: string;
                    status?: string;
                    template?: string;
                    title?: string;
                    type?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'pages_author_id_fkey';
                        columns: ['author'];
                        isOneToOne: false;
                        referencedRelation: 'authors';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'pages_featured_media_id_fkey';
                        columns: ['featured_media'];
                        isOneToOne: false;
                        referencedRelation: 'media';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'pages_parent_id_fkey';
                        columns: ['parent'];
                        isOneToOne: false;
                        referencedRelation: 'pages';
                        referencedColumns: ['id'];
                    }
                ];
            };
            post_categories: {
                Row: {
                    category_id: number;
                    post_id: number;
                };
                Insert: {
                    category_id: number;
                    post_id: number;
                };
                Update: {
                    category_id?: number;
                    post_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'post_categories_category_id_fkey';
                        columns: ['category_id'];
                        isOneToOne: false;
                        referencedRelation: 'categories';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'post_categories_post_id_fkey';
                        columns: ['post_id'];
                        isOneToOne: false;
                        referencedRelation: 'posts';
                        referencedColumns: ['id'];
                    }
                ];
            };
            post_tags: {
                Row: {
                    post_id: number;
                    tag_id: number;
                };
                Insert: {
                    post_id: number;
                    tag_id: number;
                };
                Update: {
                    post_id?: number;
                    tag_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'post_tags_post_id_fkey';
                        columns: ['post_id'];
                        isOneToOne: false;
                        referencedRelation: 'posts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'post_tags_tag_id_fkey';
                        columns: ['tag_id'];
                        isOneToOne: false;
                        referencedRelation: 'tags';
                        referencedColumns: ['id'];
                    }
                ];
            };
            posts: {
                Row: {
                    author: number;
                    categories: Json | null;
                    claps: number | null;
                    comment_status: string;
                    content: string;
                    created_at: string | null;
                    date: string;
                    date_gmt: string;
                    excerpt: string;
                    featured_media: number | null;
                    format: string;
                    guid: string;
                    id: number;
                    link: string;
                    meta: Json | null;
                    modified: string;
                    modified_gmt: string;
                    ping_status: string;
                    slug: string;
                    status: string;
                    sticky: boolean;
                    tags: Json | null;
                    template: string;
                    title: string;
                    type: string;
                    updated_at: string | null;
                    views: number | null;
                };
                Insert: {
                    author?: number;
                    categories?: Json | null;
                    claps?: number | null;
                    comment_status?: string;
                    content: string;
                    created_at?: string | null;
                    date?: string;
                    date_gmt?: string;
                    excerpt: string;
                    featured_media?: number | null;
                    format?: string;
                    guid?: string;
                    id?: never;
                    link: string;
                    meta?: Json | null;
                    modified?: string;
                    modified_gmt?: string;
                    ping_status?: string;
                    slug: string;
                    status?: string;
                    sticky?: boolean;
                    tags?: Json | null;
                    template?: string;
                    title: string;
                    type?: string;
                    updated_at?: string | null;
                    views?: number | null;
                };
                Update: {
                    author?: number;
                    categories?: Json | null;
                    claps?: number | null;
                    comment_status?: string;
                    content?: string;
                    created_at?: string | null;
                    date?: string;
                    date_gmt?: string;
                    excerpt?: string;
                    featured_media?: number | null;
                    format?: string;
                    guid?: string;
                    id?: never;
                    link?: string;
                    meta?: Json | null;
                    modified?: string;
                    modified_gmt?: string;
                    ping_status?: string;
                    slug?: string;
                    status?: string;
                    sticky?: boolean;
                    tags?: Json | null;
                    template?: string;
                    title?: string;
                    type?: string;
                    updated_at?: string | null;
                    views?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'posts_author_id_fkey';
                        columns: ['author'];
                        isOneToOne: false;
                        referencedRelation: 'authors';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'posts_featured_media_id_fkey';
                        columns: ['featured_media'];
                        isOneToOne: false;
                        referencedRelation: 'media';
                        referencedColumns: ['id'];
                    }
                ];
            };
            tags: {
                Row: {
                    count: number | null;
                    description: string | null;
                    id: number;
                    link: string | null;
                    meta: Json | null;
                    name: string;
                    slug: string;
                    taxonomy: string;
                };
                Insert: {
                    count?: number | null;
                    description?: string | null;
                    id?: never;
                    link?: string | null;
                    meta?: Json | null;
                    name: string;
                    slug: string;
                    taxonomy?: string;
                };
                Update: {
                    count?: number | null;
                    description?: string | null;
                    id?: never;
                    link?: string | null;
                    meta?: Json | null;
                    name?: string;
                    slug?: string;
                    taxonomy?: string;
                };
                Relationships: [];
            };
            users: {
                Row: {
                    email: string | null;
                    id: string;
                    image: string | null;
                    name: string | null;
                };
                Insert: {
                    email?: string | null;
                    id?: string;
                    image?: string | null;
                    name?: string | null;
                };
                Update: {
                    email?: string | null;
                    id?: string;
                    image?: string | null;
                    name?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'users_id_fkey';
                        columns: ['id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'users_id_fkey1';
                        columns: ['id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            increment_views: {
                Args: {
                    post_id: number;
                };
                Returns: number;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
      ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never;
