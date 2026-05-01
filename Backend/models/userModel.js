const pool = require("../db");

exports.createUser = async (user) => {
  const res = await pool.query(
    `INSERT INTO users(
      user_type,
      name,
      company_name,
      address,
      email,
      phone,
      gst_no,
      password
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      user.userType,
      user.name,
      user.companyName,
      user.address,
      user.email,
      user.phone,
      user.gstNo,
      user.password,
    ]
  );
  return res.rows[0];
};
exports.findUser = async (email) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE LOWER(email)=LOWER($1)',
    [email]
  );
  return res.rows[0];
};

exports.updateProfile = async (id, profile) => {
  const res = await pool.query(
    `UPDATE users
     SET name = $1,
         company_name = $2,
         profile_image = $3
     WHERE id = $4
     RETURNING id, name, user_type, company_name, profile_image`,
    [profile.name, profile.companyName, profile.profileImage, id]
  );

  return res.rows[0];
};
