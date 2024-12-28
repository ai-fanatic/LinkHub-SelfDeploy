import { initializeDatabase } from './neon-db';
import { ProfileService } from '../services/profileService';

export async function initializeApp() {
    try {
        // Initialize main database tables
        await initializeDatabase();
        
        // Initialize profile table
        await ProfileService.initializeDatabase();
        
        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}
