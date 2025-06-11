import { query } from '$lib/database/db.js';
import { json } from '@sveltejs/kit';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export async function GET() {
    try {
        const donations = await query(`
            SELECT 
                d.*,
                p.title as project_title
            FROM donations d
            JOIN projects p ON d.project_id = p.id
            ORDER BY d.created_at DESC
            LIMIT 50
        `);
        return json(donations);
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch donations' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/** @type {import('./$types').RequestHandler['POST']} */
export async function POST({ request }) {
    const { projectId, amount, phoneNumber } = await request.json();
    
    const connection = await mysql.createConnection({
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME
    });
    
    try {
        // Create pending donation record
        const [result] = await connection.execute(
            'INSERT INTO donations (project_id, amount, phone_number, status) VALUES (?, ?, ?, ?)',
            [projectId, amount, phoneNumber, 'pending']
        );
        
        // Check if we have a valid result with insertId
        if (result && typeof result === 'object' && 'insertId' in result) {
            return json({ success: true, donationId: result.insertId });
        }
        
        throw new Error('Failed to get insertion ID');
    } catch (error) {
        console.error('Database error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return json({ success: false, error: errorMessage }, { status: 500 });
    } finally {
        await connection.end();
    }
} 