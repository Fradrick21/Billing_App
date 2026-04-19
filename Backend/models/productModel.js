const pool = require("../db");

exports.getAll = async () => {
  const res = await pool.query("SELECT * FROM products ORDER BY id DESC");
  return res.rows;
};

exports.create = async (name, price, tax) => {
  const res = await pool.query(
    "INSERT INTO products(name, price, tax_percentage) VALUES($1,$2,$3) RETURNING *",
    [name, price, tax]
  );
  return res.rows[0];
};

exports.update = async (id, name, price, tax) => {
  const res = await pool.query(
    "UPDATE products SET name=$1, price=$2, tax_percentage=$3 WHERE id=$4 RETURNING *",
    [name, price, tax, id]
  );
  return res.rows[0];
};

exports.delete = async (id) => {
  await pool.query("DELETE FROM products WHERE id=$1", [id]);
};