const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Billing",
  password: "root",
  port: 5432,
});
