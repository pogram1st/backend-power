import Postgres from 'pg';

const pool = new Postgres.Pool({
  user: 'postgres',
  password: '12345',
  host: 'localhost',
  port: 5432,
  database: 'test_power_users',
});

export default pool;
