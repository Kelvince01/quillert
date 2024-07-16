CREATE TABLE IF NOT EXISTS "author_avatars" (
	"id" serial PRIMARY KEY NOT NULL,
	"size" text NOT NULL,
	"url" text NOT NULL,
	"author" integer NOT NULL,
	CONSTRAINT "author_avatars_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"email" text NOT NULL,
	"meta" json,
	"link" text,
	"url" text,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug"),
	CONSTRAINT "authors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"count" integer,
	"slug" text NOT NULL,
	"meta" json,
	"link" text,
	"parent" integer,
	"taxonomy" text NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt_text" text,
	"caption" text,
	"count" timestamp NOT NULL,
	"slug" text NOT NULL,
	"link" text NOT NULL,
	"media_type" text,
	"mime_type" text,
	"media_details" json,
	"source_url" text,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"author" integer NOT NULL,
	CONSTRAINT "media_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"comment_status" text NOT NULL,
	"excerpt" text NOT NULL,
	"guid" text NOT NULL,
	"link" text NOT NULL,
	"meta" json,
	"modified" timestamp NOT NULL,
	"modified_gmt" timestamp NOT NULL,
	"date" timestamp NOT NULL,
	"date_gmt" timestamp NOT NULL,
	"ping_status" text NOT NULL,
	"status" text NOT NULL,
	"sticky" text NOT NULL,
	"format" integer,
	"template" text NOT NULL,
	"type" text NOT NULL,
	"featured_media" integer,
	"author" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"comment_status" text NOT NULL,
	"excerpt" text NOT NULL,
	"guid" text NOT NULL,
	"link" text NOT NULL,
	"meta" json,
	"modified" timestamp NOT NULL,
	"modified_gmt" timestamp NOT NULL,
	"date" timestamp NOT NULL,
	"date_gmt" timestamp NOT NULL,
	"ping_status" text NOT NULL,
	"status" text NOT NULL,
	"tags" json,
	"categories" json,
	"sticky" text NOT NULL,
	"format" text NOT NULL,
	"template" text NOT NULL,
	"type" text NOT NULL,
	"featured_media" integer,
	"author" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"count" integer,
	"slug" text NOT NULL,
	"meta" json,
	"link" text,
	"taxonomy" text NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_avatars" ADD CONSTRAINT "author_avatars_author_authors_id_fk" FOREIGN KEY ("author") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_author_authors_id_fk" FOREIGN KEY ("author") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_featured_media_media_id_fk" FOREIGN KEY ("featured_media") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_author_authors_id_fk" FOREIGN KEY ("author") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_media_media_id_fk" FOREIGN KEY ("featured_media") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_author_authors_id_fk" FOREIGN KEY ("author") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
