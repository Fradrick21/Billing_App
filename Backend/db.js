const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL;

if (isProduction && !connectionString) {
  throw new Error(
    "DATABASE_URL is required in production. Set it in your Render service or attach a Render Postgres database."
  );
}

module.exports = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
      }
    : {
        user: process.env.PGUSER || "postgres",
        host: process.env.PGHOST || "localhost",
        database: process.env.PGDATABASE || "Billing",
        password: process.env.PGPASSWORD || "root",
        port: Number(process.env.PGPORT) || 5432,
      }
);
