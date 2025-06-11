import { writable } from 'svelte/store';

// Create a writable store for authentication state
export const isAuthenticated = writable(false);

// Create a writable store for user data
export const user = writable(null);

// Simple admin credentials (in a real app, this would be in a database)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export async function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        isAuthenticated.set(true);
        user.set({ username });
        return true;
    }
    return false;
}

export function logout() {
    isAuthenticated.set(false);
    user.set(null);
} 