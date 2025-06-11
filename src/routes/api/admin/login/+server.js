import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

export async function POST({ request }) {
    try {
        const { username, password } = await request.json();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            return json({ success: true });
        }

        return new Response(
            JSON.stringify({ error: 'Invalid credentials' }), 
            { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Login failed' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 