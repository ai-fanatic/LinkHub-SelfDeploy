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
                .addColumn('social_links', 'jsonb')
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
        const result = await db
            .selectFrom('profiles')
            .selectAll()
            .orderBy('created_at', 'desc')
            .limit(1)
            .executeTakeFirst();

        if (!result) return null;

        return {
            ...result,
            imageShape: result.image_shape,
            imagePosition: result.image_position,
            socialLinks: result.social_links,
        };
    }

    static async saveProfile(profile: UserProfile) {
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
                    role: profile.role,
                    bio: profile.bio,
                    email: profile.email,
                    phone: profile.phone,
                    avatar: profile.avatar,
                    image_shape: profile.imageShape,
                    image_position: profile.imagePosition,
                    social_links: profile.socialLinks,
                })
                .execute();
        });

        return true;
    }
}
