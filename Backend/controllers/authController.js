const userModel = require('../models/userModel');

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userModel.createUser(name, email, password);
  res.json(user);
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findUser(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login success' });
};