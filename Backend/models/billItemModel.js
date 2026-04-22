const pool = require("../server/db");

exports.createItem = async (billId, item) => {
  await pool.query(
    "INSERT INTO bill_items(bill_id, product_id, quantity, price, tax, total) VALUES($1,$2,$3,$4,$5,$6)",
    [billId, item.product_id, item.quantity, item.price, item.tax, item.total]
  );
};
