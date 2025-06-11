import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const connection = await mysql.createConnection({
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME
    });
    
    try {
        // Get all projects
        const [projects] = await connection.execute(
            'SELECT * FROM projects ORDER BY created_at DESC'
        );
        
        // Get all donations with project details
        const [donations] = await connection.execute(`
            SELECT d.*, p.title as project_title 
            FROM donations d 
            JOIN projects p ON d.project_id = p.id 
            ORDER BY d.created_at DESC 
            LIMIT 100
        `);
        
        return {
            projects,
            donations
        };
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    } finally {
        await connection.end();
    }
} 