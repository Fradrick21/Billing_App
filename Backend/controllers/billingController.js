const billModel = require("../models/billModel");
const itemModel = require("../models/billItemModel");

exports.createBill = async (req, res) => {
  try {
    const { items, total, tax, grandTotal } = req.body;

    const bill = await billModel.createBill(total, tax, grandTotal);

    for (let item of items) {
      await itemModel.createItem(bill.id, item);
    }

    res.json({ message: "Bill saved", billId: bill.id });
  } catch (error) {
    console.error("createBill failed:", error);
    res.status(500).json({ message: "Unable to save bill" });
  }
};
