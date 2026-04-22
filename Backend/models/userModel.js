const pool = require("../db");

exports.createUser = async (name, email, password) => {
  const res = await pool.query(
    'INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *',
    [name, email, password]
  );
  return res.rows[0];
};
exports.findUser = async (email) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );
  return res.rows[0];
};
