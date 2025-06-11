import { query } from '$lib/database/db.js';
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
        return json(projects);
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request }) {
    try {
        const { title, description, target_amount } = await request.json();
        
        const result = await query(
            'INSERT INTO projects (title, description, target_amount) VALUES (?, ?, ?)',
            [title, description, target_amount]
        );

        return json({ id: result.insertId }, { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create project' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 