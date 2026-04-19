const pool = require("../db");

exports.createBill = async (total, tax, grand) => {
  const res = await pool.query(
    "INSERT INTO bills(total_amount, total_tax, grand_total) VALUES($1,$2,$3) RETURNING *",
    [total, tax, grand]
  );
  return res.rows[0];
};