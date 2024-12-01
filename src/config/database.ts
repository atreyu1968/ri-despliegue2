import mariadb from 'mariadb';
import { z } from 'zod';

// Schema de validación para las variables de entorno
const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_CONNECTION_LIMIT: z.string().transform(Number).default('5'),
});

// Validar variables de entorno
const env = envSchema.parse({
  DB_HOST: import.meta.env.VITE_DB_HOST,
  DB_PORT: import.meta.env.VITE_DB_PORT,
  DB_USER: import.meta.env.VITE_DB_USER,
  DB_PASSWORD: import.meta.env.VITE_DB_PASSWORD,
  DB_NAME: import.meta.env.VITE_DB_NAME,
  DB_CONNECTION_LIMIT: import.meta.env.VITE_DB_CONNECTION_LIMIT,
});

// Crear pool de conexiones
const pool = mariadb.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: env.DB_CONNECTION_LIMIT,
  // Configuraciones adicionales de seguridad
  ssl: {
    rejectUnauthorized: true
  }
});

export const executeQuery = async <T>(query: string, params?: any[]): Promise<T> => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, params);
    return result as T;
  } catch (err) {
    console.error('Database error:', err);
    throw new Error('Error executing database query');
  } finally {
    if (conn) conn.release();
  }
};

export const transaction = async <T>(
  callback: (conn: mariadb.Connection) => Promise<T>
): Promise<T> => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    
    const result = await callback(conn);
    
    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Transaction error:', err);
    throw new Error('Error executing database transaction');
  } finally {
    if (conn) conn.release();
  }
};