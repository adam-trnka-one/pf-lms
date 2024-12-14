import { Pool } from 'pg';

const pool = new Pool({
  host: 'postgresql.r3.websupport.cz',
  port: 5432,
  database: 'pf_lms',
  user: 'pf_lms_admin',
  password: 'ProductFruitsLMS1',
  ssl: {
    rejectUnauthorized: false // Required for some hosting providers
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
    console.log('Database connected successfully');
  });
});

export default pool;