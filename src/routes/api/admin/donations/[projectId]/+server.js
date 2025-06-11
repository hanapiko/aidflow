import { json } from '@sveltejs/kit';
import { query } from '$lib/database/db.js';

export async function GET({ params }) {
    try {
        const donations = await query(`
            SELECT 
                d.*,
                p.title as project_title
            FROM donations d
            JOIN projects p ON d.project_id = p.id
            WHERE d.project_id = ?
            ORDER BY d.created_at DESC
        `, [params.projectId]);

        return json(donations);
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch donations' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 