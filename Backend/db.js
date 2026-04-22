const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

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
