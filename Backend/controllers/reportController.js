const pool = require("../db");

exports.getDetails = async (req, res) => {
  try {
    const { date, invoiceNo } = req.query;

    let query = `
      SELECT
        b.id AS bill_id,
        b.created_at,
        b.total_amount,
        b.total_tax,
        b.grand_total,
        bi.id AS item_id,
        bi.product_id,
        COALESCE(p.name, '') AS product_name,
        COALESCE(p.tax_percentage, 0) AS tax_rate,
        bi.quantity,
        bi.price,
        bi.tax,
        bi.total
      FROM bills b
      LEFT JOIN bill_items bi ON bi.bill_id = b.id
      LEFT JOIN products p ON p.id = bi.product_id
    `;
    let values = [];
    let conditions = [];

    if (date) {
      conditions.push(`DATE(b.created_at) = $${values.length + 1}`);
      values.push(date);
    }

    if (invoiceNo) {
      const parsedInvoiceNo = Number.parseInt(invoiceNo, 10);
      if (!Number.isNaN(parsedInvoiceNo)) {
        conditions.push(`b.id = $${values.length + 1}`);
        values.push(parsedInvoiceNo);
      }
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY b.id DESC, bi.id ASC";

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error("getDetails failed:", error);
    res.status(500).json({ message: "Unable to load reports" });
  }
};
