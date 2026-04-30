const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT a.email, a.last_login, COUNT(r.id) as active_sessions
    FROM admins a
    LEFT JOIN refresh_tokens r ON r.admin_id = a.id AND r.expires_at > NOW()
    GROUP BY a.id, a.email, a.last_login;
  `);
  console.log(res.rows);
  await client.end();
}
run();
