import { getDatabase } from '../db/database';

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
        const db = await getDatabase();
        
        const result = await db!.run(
            `INSERT INTO links (url, title, description) VALUES (?, ?, ?)`,
            [link.url, link.title, link.description]
        );

        if (link.tags && link.tags.length > 0) {
            for (const tagName of link.tags) {
                // Insert tag if it doesn't exist
                await db!.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
                
                // Get tag id
                const tag = await db!.get('SELECT id FROM tags WHERE name = ?', [tagName]);
                
                // Create link-tag association
                await db!.run(
                    'INSERT INTO link_tags (link_id, tag_id) VALUES (?, ?)',
                    [result.lastID, tag.id]
                );
            }
        }

        return result.lastID;
    }

    // Get a link by ID with its tags
    static async getLinkById(id: number) {
        const db = await getDatabase();
        
        const link = await db!.get(`
            SELECT l.*, GROUP_CONCAT(t.name) as tags
            FROM links l
            LEFT JOIN link_tags lt ON l.id = lt.link_id
            LEFT JOIN tags t ON lt.tag_id = t.id
            WHERE l.id = ?
            GROUP BY l.id
        `, [id]);

        if (link) {
            link.tags = link.tags ? link.tags.split(',') : [];
        }

        return link;
    }

    // Get all links with optional tag filter
    static async getLinks(tag?: string) {
        const db = await getDatabase();
        
        let query = `
            SELECT l.*, GROUP_CONCAT(t.name) as tags
            FROM links l
            LEFT JOIN link_tags lt ON l.id = lt.link_id
            LEFT JOIN tags t ON lt.tag_id = t.id
        `;

        const params: any[] = [];
        if (tag) {
            query += ` WHERE EXISTS (
                SELECT 1 FROM link_tags lt2
                JOIN tags t2 ON lt2.tag_id = t2.id
                WHERE lt2.link_id = l.id AND t2.name = ?
            )`;
            params.push(tag);
        }

        query += ' GROUP BY l.id ORDER BY l.created_at DESC';

        const links = await db!.all(query, params);
        return links.map(link => ({
            ...link,
            tags: link.tags ? link.tags.split(',') : []
        }));
    }

    // Update a link
    static async updateLink(id: number, link: Partial<Link>) {
        const db = await getDatabase();
        
        const updates: string[] = [];
        const values: any[] = [];

        if (link.url) {
            updates.push('url = ?');
            values.push(link.url);
        }
        if (link.title !== undefined) {
            updates.push('title = ?');
            values.push(link.title);
        }
        if (link.description !== undefined) {
            updates.push('description = ?');
            values.push(link.description);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const result = await db!.run(
            `UPDATE links SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (link.tags) {
            // Remove existing tags
            await db!.run('DELETE FROM link_tags WHERE link_id = ?', [id]);

            // Add new tags
            for (const tagName of link.tags) {
                await db!.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
                const tag = await db!.get('SELECT id FROM tags WHERE name = ?', [tagName]);
                await db!.run(
                    'INSERT INTO link_tags (link_id, tag_id) VALUES (?, ?)',
                    [id, tag.id]
                );
            }
        }

        return result.changes > 0;
    }

    // Delete a link
    static async deleteLink(id: number) {
        const db = await getDatabase();
        const result = await db!.run('DELETE FROM links WHERE id = ?', [id]);
        return result.changes > 0;
    }

    // Increment share count
    static async incrementShareCount(id: number) {
        const db = await getDatabase();
        const result = await db!.run(
            'UPDATE links SET share_count = share_count + 1 WHERE id = ?',
            [id]
        );
        return result.changes > 0;
    }
}
