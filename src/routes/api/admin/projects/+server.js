import { json } from '@sveltejs/kit';
import { query } from '$lib/database/db.js';

export async function GET() {
    try {
        const projects = await query(`
            SELECT 
                p.*,
                COUNT(d.id) as donation_count,
                SUM(CASE WHEN d.status = 'completed' THEN d.amount ELSE 0 END) as total_donations
            FROM projects p
            LEFT JOIN donations d ON p.id = d.project_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);

        return json(projects);
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch projects' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function POST({ request }) {
    try {
        const { title, description, target_amount, image_url } = await request.json();
        
        const result = await query(
            'INSERT INTO projects (title, description, target_amount, image_url) VALUES (?, ?, ?, ?)',
            [title, description, target_amount, image_url]
        );

        return json({ id: result.insertId }, { status: 201 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to create project' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 