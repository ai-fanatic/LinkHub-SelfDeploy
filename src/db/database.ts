import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { join } from 'path';

// Database singleton instance
let db: Database | null = null;

export async function initializeDatabase() {
    if (db) return db;

    db = await open({
        filename: join(process.cwd(), 'linkhub.db'),
        driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            title TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            share_count INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS link_tags (
            link_id INTEGER,
            tag_id INTEGER,
            PRIMARY KEY (link_id, tag_id),
            FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
    `);

    return db;
}

export async function getDatabase() {
    if (!db) {
        await initializeDatabase();
    }
    return db;
}
