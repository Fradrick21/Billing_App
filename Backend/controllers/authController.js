const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const userType = req.body.userType === "company" ? "company" : "individual";
    const user = {
      userType,
      name: String(req.body.name || "").trim(),
      email: String(req.body.email || "").trim().toLowerCase(),
      phone: String(req.body.phone || "").trim(),
      password: String(req.body.password || ""),
      companyName: userType === "company" ? String(req.body.companyName || "").trim() : null,
      address: userType === "company" ? String(req.body.address || "").trim() : null,
      gstNo: userType === "company" ? String(req.body.gstNo || "").trim() : null,
    };

    if (!user.name || !user.email || !user.phone || !user.password) {
      return res.status(400).json({ message: "Name, email, phone, and password are required" });
    }

    if (user.userType === "company" && (!user.companyName || !user.address || !user.gstNo)) {
      return res.status(400).json({ message: "Company name, address, and GST No are required" });
    }

    const createdUser = await userModel.createUser(user);
    res.json(createdUser);
  } catch (error) {
    console.error("register failed:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }

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

    res.json({
      message: 'Login success',
      user: {
        id: user.id,
        name: user.name,
        userType: user.user_type,
        companyName: user.company_name,
        profileImage: user.profile_image,
      },
    });
  } catch (error) {
    console.error("login failed:", error);
    res.status(500).json({ message: "Unable to login" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const name = String(req.body.name || "").trim();
    const companyName = req.body.companyName ? String(req.body.companyName).trim() : null;
    const profileImage = req.body.profileImage ? String(req.body.profileImage) : null;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await userModel.updateProfile(id, {
      name,
      companyName,
      profileImage,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        name: user.name,
        userType: user.user_type,
        companyName: user.company_name,
        profileImage: user.profile_image,
      },
    });
  } catch (error) {
    console.error("profile update failed:", error);
    res.status(500).json({ message: "Unable to update profile" });
  }
};
