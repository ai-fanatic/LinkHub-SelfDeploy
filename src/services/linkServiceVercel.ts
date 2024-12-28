import { db } from '../db/vercel-postgres';

export interface Link {
    id?: number;
    url: string;
    title?: string;
    description?: string;
    tags?: string[];
}

export class LinkService {
    // Create a new link
    static async createLink(link: Link) {
        return await db.transaction().execute(async (trx) => {
            // Insert link
            const [newLink] = await trx
                .insertInto('links')
                .values({
                    url: link.url,
                    title: link.title || null,
                    description: link.description || null,
                })
                .returning('id')
                .execute();

            // Handle tags
            if (link.tags && link.tags.length > 0) {
                for (const tagName of link.tags) {
                    // Insert tag if it doesn't exist
                    const [tag] = await trx
                        .insertInto('tags')
                        .values({ name: tagName })
                        .onConflict((oc) => oc
                            .column('name')
                            .doNothing())
                        .returning('id')
                        .execute();

                    // Get tag id if it wasn't inserted
                    const tagId = tag?.id || (await trx
                        .selectFrom('tags')
                        .where('name', '=', tagName)
                        .select('id')
                        .executeTakeFirstOrThrow()).id;

                    // Create link-tag association
                    await trx
                        .insertInto('link_tags')
                        .values({
                            link_id: newLink.id,
                            tag_id: tagId,
                        })
                        .execute();
                }
            }

            return newLink.id;
        });
    }

    // Get a link by ID with its tags
    static async getLinkById(id: number) {
        const result = await db
            .selectFrom('links as l')
            .leftJoin('link_tags as lt', 'l.id', 'lt.link_id')
            .leftJoin('tags as t', 'lt.tag_id', 't.id')
            .where('l.id', '=', id)
            .select([
                'l.id',
                'l.url',
                'l.title',
                'l.description',
                'l.created_at',
                'l.updated_at',
                'l.share_count',
                db.fn.agg<string[]>('array_agg', ['t.name']).as('tags'),
            ])
            .groupBy(['l.id'])
            .executeTakeFirst();

        if (result) {
            return {
                ...result,
                tags: result.tags?.filter(Boolean) || [],
            };
        }

        return null;
    }

    // Get all links with optional tag filter
    static async getLinks(tag?: string) {
        let query = db
            .selectFrom('links as l')
            .leftJoin('link_tags as lt', 'l.id', 'lt.link_id')
            .leftJoin('tags as t', 'lt.tag_id', 't.id');

        if (tag) {
            query = query.where('t.name', '=', tag);
        }

        const results = await query
            .select([
                'l.id',
                'l.url',
                'l.title',
                'l.description',
                'l.created_at',
                'l.updated_at',
                'l.share_count',
                db.fn.agg<string[]>('array_agg', ['t.name']).as('tags'),
            ])
            .groupBy(['l.id'])
            .orderBy('l.created_at', 'desc')
            .execute();

        return results.map(result => ({
            ...result,
            tags: result.tags?.filter(Boolean) || [],
        }));
    }

    // Update a link
    static async updateLink(id: number, link: Partial<Link>) {
        return await db.transaction().execute(async (trx) => {
            // Update link
            if (link.url || link.title !== undefined || link.description !== undefined) {
                await trx
                    .updateTable('links')
                    .set({
                        ...(link.url && { url: link.url }),
                        ...(link.title !== undefined && { title: link.title }),
                        ...(link.description !== undefined && { description: link.description }),
                        updated_at: new Date(),
                    })
                    .where('id', '=', id)
                    .execute();
            }

            // Update tags if provided
            if (link.tags !== undefined) {
                // Remove existing tags
                await trx
                    .deleteFrom('link_tags')
                    .where('link_id', '=', id)
                    .execute();

                // Add new tags
                for (const tagName of link.tags) {
                    // Insert tag if it doesn't exist
                    const [tag] = await trx
                        .insertInto('tags')
                        .values({ name: tagName })
                        .onConflict((oc) => oc
                            .column('name')
                            .doNothing())
                        .returning('id')
                        .execute();

                    // Get tag id if it wasn't inserted
                    const tagId = tag?.id || (await trx
                        .selectFrom('tags')
                        .where('name', '=', tagName)
                        .select('id')
                        .executeTakeFirstOrThrow()).id;

                    // Create link-tag association
                    await trx
                        .insertInto('link_tags')
                        .values({
                            link_id: id,
                            tag_id: tagId,
                        })
                        .execute();
                }
            }

            return true;
        });
    }

    // Delete a link
    static async deleteLink(id: number) {
        const result = await db
            .deleteFrom('links')
            .where('id', '=', id)
            .execute();

        return result.length > 0;
    }

    // Increment share count
    static async incrementShareCount(id: number) {
        const result = await db
            .updateTable('links')
            .set((eb) => ({
                share_count: eb('share_count', '+', 1),
            }))
            .where('id', '=', id)
            .execute();

        return result.length > 0;
    }
}
