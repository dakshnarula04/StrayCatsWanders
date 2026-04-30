const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  await client.query(`ALTER TABLE admins RENAME COLUMN email TO username;`);
  // Update the existing admin user to have a valid username instead of email if needed,
  // or just leave the email string as the username for now.
  await client.query(`UPDATE admins SET username = 'admin' WHERE username = 'admin@straycatwebsite.com';`);
  console.log("Migration done");
  await client.end();
}
run();
