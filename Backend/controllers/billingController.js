const billModel = require("../models/billModel");
const itemModel = require("../models/billItemModel");

exports.createBill = async (req, res) => {
  const { items, total, tax, grandTotal } = req.body;

  const bill = await billModel.createBill(total, tax, grandTotal);

  for (let item of items) {
    await itemModel.createItem(bill.id, item);
  }

  res.json({ message: "Bill saved", billId: bill.id });
};