const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect()
  .then(() => client.query('GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;'))
  .then(() => client.query('GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;'))
  .then(() => client.query('GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;'))
  .then(() => client.query('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;'))
  .then(() => {
    console.log("Grants successfully applied.");
  })
  .catch(console.error)
  .finally(() => client.end());
