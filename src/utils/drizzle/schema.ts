import { integer, json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sql, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

export const sqlJSON = <TC extends PgColumn, TD = Exclude<TC['default'], SQL<unknown>>>(
    column: TC,
    data: TD
) => {
    return sql`${JSON.stringify(data)}::json`;
};

export const authorsTable = pgTable('authors', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    email: text('email').notNull().unique(),
    meta: json('meta'),
    link: text('link'),
    url: text('url')
});

export const authorAvatarsTable = pgTable('author_avatars', {
    id: serial('id').primaryKey(),
    size: text('size').notNull(),
    url: text('url').notNull().unique(),
    author: integer('author')
        .notNull()
        .references(() => authorsTable.id, { onDelete: 'cascade' })
});

export const tagsTable = pgTable('tags', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    count: integer('count'),
    slug: text('slug').notNull().unique(),
    meta: json('meta'),
    link: text('link'),
    taxonomy: text('taxonomy').notNull()
});

export const categoriesTable = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    count: integer('count'),
    slug: text('slug').notNull().unique(),
    meta: json('meta'),
    link: text('link'),
    parent: integer('parent'),
    taxonomy: text('taxonomy').notNull()
});

export const mediaTable = pgTable('media', {
    id: serial('id').primaryKey(),
    alt_text: text('alt_text'),
    caption: text('caption'),
    date: timestamp('count').notNull(),
    slug: text('slug').notNull().unique(),
    link: text('link').notNull(),
    media_type: text('media_type'),
    mime_type: text('mime_type'),
    media_details: json('media_details'),
    source_url: text('source_url'),
    title: text('title').notNull(),
    type: text('type').notNull(),
    author: integer('author')
        .notNull()
        .references(() => authorsTable.id, { onDelete: 'cascade' })
});

export const postsTable = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    comment_status: text('comment_status').notNull(),
    excerpt: text('excerpt').notNull(),
    guid: text('guid').notNull(),
    link: text('link').notNull(),
    meta: json('meta'),
    modified: timestamp('modified').notNull(),
    modified_gmt: timestamp('modified_gmt').notNull(),
    date: timestamp('date').notNull(),
    date_gmt: timestamp('date_gmt').notNull(),
    ping_status: text('ping_status').notNull(),
    status: text('status').notNull(),
    slug: text('status').notNull(),
    tags: json('tags'),
    // categories: json('categories').$type<{ data: string }>,
    categories: json('categories'),
    sticky: text('sticky').notNull(),
    format: text('format').notNull(),
    template: text('template').notNull(),
    type: text('type').notNull(),
    featured_media: integer('featured_media').references(() => mediaTable.id, {
        onDelete: 'cascade'
    }),
    author: integer('author')
        .notNull()
        .references(() => authorsTable.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
});

export const pagesTable = pgTable('pages', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    comment_status: text('comment_status').notNull(),
    excerpt: text('excerpt').notNull(),
    guid: text('guid').notNull(),
    link: text('link').notNull(),
    meta: json('meta'),
    modified: timestamp('modified').notNull(),
    modified_gmt: timestamp('modified_gmt').notNull(),
    date: timestamp('date').notNull(),
    date_gmt: timestamp('date_gmt').notNull(),
    ping_status: text('ping_status').notNull(),
    status: text('status').notNull(),
    slug: text('status').notNull(),
    sticky: text('sticky').notNull(),
    menu_order: integer('format'),
    parent: integer('format'),
    template: text('template').notNull(),
    type: text('type').notNull(),
    featured_media: integer('featured_media').references(() => mediaTable.id, {
        onDelete: 'cascade'
    }),
    author: integer('author')
        .notNull()
        .references(() => authorsTable.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
});

export type InsertUser = typeof authorsTable.$inferInsert;
export type SelectUser = typeof authorsTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
