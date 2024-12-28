import { initializeDatabase } from './neon-db';
import { ProfileService } from '../services/profileService';

export async function initializeApp() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set in environment variables');
        return;
    }

    try {
        // Initialize main database tables
        await initializeDatabase();
        
        // Initialize profile table
        await ProfileService.initializeDatabase();
        
        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        console.error('Application will continue without database functionality');
    }
}
