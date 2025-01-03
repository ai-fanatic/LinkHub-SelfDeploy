import { Kysely } from 'kysely';
import { NeonDialect } from 'kysely-neon';
import { Pool } from '@neondatabase/serverless';

interface LinksTable {
    id: number;
    url: string;
    title: string | null;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    share_count: number;
    is_active: boolean;
}

interface TagsTable {
    id: number;
    name: string;
}

interface LinkTagsTable {
    link_id: number;
    tag_id: number;
}

interface ProfilesTable {
    id: number;
    name: string;
    role: string | null;
    bio: string | null;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    image_shape: string | null;
    image_position: number | null;
    social_links: unknown;
    created_at: Date;
    updated_at: Date;
}

interface Database {
    links: LinksTable;
    tags: TagsTable;
    link_tags: LinkTagsTable;
    profiles: ProfilesTable;
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create database instance
export const db = new Kysely<Database>({
    dialect: new NeonDialect({
        connectionString: process.env.DATABASE_URL,
    }),
});

// Initialize database tables
export async function initializeDatabase() {
    try {
        // Create links table
        await db.schema
            .createTable('links')
            .ifNotExists()
            .addColumn('id', 'serial', (col) => col.primaryKey())
            .addColumn('url', 'varchar', (col) => col.notNull())
            .addColumn('title', 'varchar')
            .addColumn('description', 'text')
            .addColumn('created_at', 'timestamp', (col) => 
                col.notNull().defaultTo('now()'))
            .addColumn('updated_at', 'timestamp', (col) => 
                col.notNull().defaultTo('now()'))
            .addColumn('share_count', 'integer', (col) => 
                col.notNull().defaultTo(0))
            .addColumn('is_active', 'boolean', (col) => 
                col.notNull().defaultTo(true))
            .execute();

        // Create tags table
        await db.schema
            .createTable('tags')
            .ifNotExists()
            .addColumn('id', 'serial', (col) => col.primaryKey())
            .addColumn('name', 'varchar', (col) => col.notNull().unique())
            .execute();

        // Create link_tags table
        await db.schema
            .createTable('link_tags')
            .ifNotExists()
            .addColumn('link_id', 'integer', (col) => 
                col.references('links.id').onDelete('cascade'))
            .addColumn('tag_id', 'integer', (col) => 
                col.references('tags.id').onDelete('cascade'))
            .addPrimaryKeyConstraint('link_tags_primary_key', ['link_id', 'tag_id'])
            .execute();

        // Create profiles table
        await db.schema
            .createTable('profiles')
            .ifNotExists()
            .addColumn('id', 'serial', (col) => col.primaryKey())
            .addColumn('name', 'varchar', (col) => col.notNull())
            .addColumn('role', 'varchar')
            .addColumn('bio', 'text')
            .addColumn('email', 'varchar')
            .addColumn('phone', 'varchar')
            .addColumn('avatar', 'varchar')
            .addColumn('image_shape', 'varchar')
            .addColumn('image_position', 'integer')
            .addColumn('social_links', 'jsonb')
            .addColumn('created_at', 'timestamp', (col) => 
                col.notNull().defaultTo('now()'))
            .addColumn('updated_at', 'timestamp', (col) => 
                col.notNull().defaultTo('now()'))
            .execute();

        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}
