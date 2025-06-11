import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
    DB_HOST = 'localhost',
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('Missing required database configuration');
    throw new Error('Missing required database configuration');
}

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Execute a database query
 * @param {string} sql - The SQL query to execute
 * @param {Array<any>} params - The parameters for the query
 * @returns {Promise<any>} The query results
 */
export async function query(sql, params) {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database operation failed');
    }
}

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(error => {
        console.error('Error connecting to database:', error);
        throw new Error('Database connection failed');
    });

export default pool;
