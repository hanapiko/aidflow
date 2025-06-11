import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { isAuthenticated } from '$lib/stores/auth';

export function load({ url }) {
    // Allow access to login page
    if (url.pathname === '/admin/login') {
        return {};
    }

    // Check if user is authenticated
    if (!get(isAuthenticated)) {
        throw redirect(302, '/admin/login');
    }

    return {};
} 