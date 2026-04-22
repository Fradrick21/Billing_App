const model = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const data = await model.getAll();
    res.json(data);
  } catch (error) {
    console.error("getProducts failed:", error);
    res.status(500).json({ message: "Unable to load products" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, tax_percentage } = req.body;
    const data = await model.create(name, price, tax_percentage);
    res.json(data);
  } catch (error) {
    console.error("addProduct failed:", error);
    res.status(500).json({ message: "Unable to save product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, tax_percentage } = req.body;

    const data = await model.update(id, name, price, tax_percentage);
    res.json(data);
  } catch (error) {
    console.error("updateProduct failed:", error);
    res.status(500).json({ message: "Unable to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await model.delete(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("deleteProduct failed:", error);
    res.status(500).json({ message: "Unable to delete product" });
  }
};
