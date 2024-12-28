import { db } from '../db/neon-db';

export interface UserProfile {
    id?: number;
    name: string;
    role?: string;
    bio?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    imageShape?: 'circle' | 'square' | 'portrait';
    imagePosition?: number;
    socialLinks: Array<{
        id: string;
        platform: string;
        url: string;
    }>;
}

export class ProfileService {
    static async initializeDatabase() {
        try {
            // Create profile table
            await db.schema
                .createTable('profiles')
                .ifNotExists()
                .addColumn('id', 'serial', (col) => col.primaryKey())
                .addColumn('name', 'varchar', (col) => col.notNull())
                .addColumn('role', 'varchar')
                .addColumn('bio', 'text')
                .addColumn('email', 'varchar')
                .addColumn('phone', 'varchar')
                .addColumn('avatar', 'text')
                .addColumn('image_shape', 'varchar')
                .addColumn('image_position', 'integer')
                .addColumn('social_links', 'jsonb', (col) => col.notNull().defaultTo('[]'))
                .addColumn('created_at', 'timestamp', (col) => 
                    col.notNull().defaultTo('now()'))
                .addColumn('updated_at', 'timestamp', (col) => 
                    col.notNull().defaultTo('now()'))
                .execute();

            console.log('Profile table initialized successfully');
        } catch (error) {
            console.error('Error initializing profile table:', error);
            throw error;
        }
    }

    static async getProfile() {
        try {
            const result = await db
                .selectFrom('profiles')
                .selectAll()
                .orderBy('created_at', 'desc')
                .limit(1)
                .executeTakeFirst();

            if (!result) return null;

            // Convert database record to UserProfile format
            const profile: UserProfile = {
                id: result.id,
                name: result.name,
                role: result.role || undefined,
                bio: result.bio || undefined,
                email: result.email || undefined,
                phone: result.phone || undefined,
                avatar: result.avatar || undefined,
                imageShape: result.image_shape as UserProfile['imageShape'],
                imagePosition: result.image_position || undefined,
                // Parse social_links only if it's a string
                socialLinks: typeof result.social_links === 'string' 
                    ? JSON.parse(result.social_links)
                    : (result.social_links || [])
            };

            return profile;
        } catch (error) {
            console.error('Error in getProfile:', error);
            throw error;
        }
    }

    static async saveProfile(profile: UserProfile) {
        try {
            await db.transaction().execute(async (trx) => {
                // Delete existing profile if exists
                await trx
                    .deleteFrom('profiles')
                    .execute();

                // Insert new profile
                await trx
                    .insertInto('profiles')
                    .values({
                        name: profile.name,
                        role: profile.role || null,
                        bio: profile.bio || null,
                        email: profile.email || null,
                        phone: profile.phone || null,
                        avatar: profile.avatar || null,
                        image_shape: profile.imageShape || null,
                        image_position: profile.imagePosition || null,
                        // Ensure social_links is stored as a JSON string
                        social_links: JSON.stringify(profile.socialLinks || [])
                    })
                    .execute();
            });

            return true;
        } catch (error) {
            console.error('Error in saveProfile:', error);
            throw error;
        }
    }
}
