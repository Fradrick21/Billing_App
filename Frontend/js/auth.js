const API = window.API_BASE_URL || "http://localhost:5000";

function showMessage(message, type = "error") {
  const target = document.getElementById("authMessage");
  if (!target) return;

  target.textContent = message;
  target.className =
    type === "error"
      ? "text-sm text-red-600 mt-3"
      : "text-sm text-green-600 mt-3";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterForm(user) {
  const {
    userType,
    name,
    email,
    phone,
    password,
    companyName,
    address,
    gstNo,
  } = user;

  if (userType !== "individual" && userType !== "company") return "Please choose a user type.";
  if (!name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!email.trim()) return "Email is required.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  if (!phone.trim()) return "Phone is required.";
  if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) return "Please enter a valid phone number.";
  if (userType === "company") {
    if (!companyName.trim()) return "Company name is required.";
    if (!address.trim()) return "Address is required.";
    if (!gstNo.trim()) return "GST No is required.";
  }
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

function validateLoginForm(email, password) {
  if (!email.trim()) return "Email is required.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  if (!password) return "Password is required.";
  return "";
}

async function register() {
  const userType = document.querySelector("input[name='userType']:checked")?.value || "individual";
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const companyName = document.getElementById("companyName")?.value || "";
  const address = document.getElementById("address")?.value || "";
  const gstNo = document.getElementById("gstNo")?.value || "";

  const payload = {
    userType,
    name,
    email,
    phone,
    password,
    companyName: userType === "company" ? companyName : "",
    address: userType === "company" ? address : "",
    gstNo: userType === "company" ? gstNo : "",
  };

  const validationError = validateRegisterForm(payload);
  if (validationError) {
    showMessage(validationError);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      showMessage("Registered successfully.", "success");
      window.location.href = "login.html";
      return;
    }

    showMessage(data.message || "Register failed");
  } catch (error) {
    showMessage("Unable to reach the server. Please try again.");
  }
}

function toggleRegisterFields() {
  const userType = document.querySelector("input[name='userType']:checked")?.value || "individual";
  const companyFields = document.getElementById("companyFields");
  if (!companyFields) return;

  companyFields.classList.toggle("hidden", userType !== "company");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const validationError = validateLoginForm(email, password);
  if (validationError) {
    showMessage(validationError);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      localStorage.setItem("token", "loggedin");
      if (data.user) {
        const displayName =
          data.user.userType === "company" && data.user.companyName
            ? data.user.companyName
            : data.user.name;

        localStorage.setItem("currentUserName", displayName || "");
        localStorage.setItem("currentUserId", data.user.id || "");
        localStorage.setItem("currentUserType", data.user.userType || "individual");
        localStorage.setItem("currentUserAccountName", data.user.name || "");
        localStorage.setItem("currentUserCompanyName", data.user.companyName || "");
        localStorage.setItem("currentUserProfileImage", data.user.profileImage || "");
      }
      showMessage("");
      window.location.href = "index.html";
      return;
    }

    showMessage(data.message || "Invalid login");
  } catch (error) {
    showMessage("Unable to reach the server. Please try again.");
  }
}
