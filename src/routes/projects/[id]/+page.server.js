import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const connection = await mysql.createConnection({
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME
    });
    
    try {
        const [projects] = await connection.execute(
            'SELECT * FROM projects WHERE id = ?',
            [params.id]
        );
        
        if (projects.length === 0) {
            throw error(404, 'Project not found');
        }
        
        return {
            project: projects[0]
        };
    } catch (e) {
        console.error('Error loading project:', e);
        throw error(500, 'Failed to load project');
    } finally {
        await connection.end();
    }
} 