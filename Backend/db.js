const { Pool } = require("pg");

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
    }
  : {
      user: process.env.PGUSER || "postgres",
      host: process.env.PGHOST || "localhost",
      database: process.env.PGDATABASE || "Billing",
      password: process.env.PGPASSWORD || "root",
      port: Number(process.env.PGPORT) || 5432,
    };

module.exports = new Pool(config);
