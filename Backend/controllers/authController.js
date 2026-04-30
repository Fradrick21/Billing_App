const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.createUser(name.trim(), email.trim().toLowerCase(), password);
    res.json(user);
  } catch (error) {
    console.error("register failed:", error);
    res.status(500).json({ message: "Unable to register user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUser(email.trim());

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login success' });
  } catch (error) {
    console.error("login failed:", error);
    res.status(500).json({ message: "Unable to login" });
  }
};
