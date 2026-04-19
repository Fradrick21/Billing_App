const model = require("../models/productModel");

exports.getProducts = async (req, res) => {
  const data = await model.getAll();
  res.json(data);
};

exports.addProduct = async (req, res) => {
  const { name, price, tax_percentage } = req.body;
  const data = await model.create(name, price, tax_percentage);
  res.json(data);
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, tax_percentage } = req.body;

  const data = await model.update(id, name, price, tax_percentage);
  res.json(data);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await model.delete(id);
  res.json({ message: "Deleted" });
};