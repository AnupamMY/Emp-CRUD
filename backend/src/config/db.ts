import mysql, { type Pool } from 'mysql2/promise';

let pool: Pool | undefined;

export function getDB(): Pool {
  if (!pool) throw new Error('MySQL has not been connected.');
  return pool;
}

export default async function connectDB() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const port = Number(process.env.DB_PORT || 3306);
  if (!DB_HOST || !DB_USER || DB_PASSWORD === undefined || !DB_NAME) {
    throw new Error(
      'Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in backend/.env.',
    );
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT must be a valid port number.');
  }
  const connectionPool = mysql.createPool({
    host: DB_HOST,
    port,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 100,
    charset: 'utf8mb4',
    timezone: 'Z',
  });
  try {
    await connectionPool.query(`CREATE TABLE IF NOT EXISTS employees (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      role VARCHAR(32) NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    pool = connectionPool;
    console.log('MySQL connected');
  } catch (error) {
    await connectionPool.end();
    throw error;
  }
}
