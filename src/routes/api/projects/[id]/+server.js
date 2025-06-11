import { json } from '@sveltejs/kit';
import { query } from '$lib/database/db.js';

export async function GET({ params }) {
    try {
        const projects = await query('SELECT * FROM projects WHERE id = ?', [params.id]);
        
        if (projects.length === 0) {
            return new Response(JSON.stringify({ error: 'Project not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return json(projects[0]);
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch project' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 