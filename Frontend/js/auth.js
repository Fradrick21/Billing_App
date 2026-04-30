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

function validateRegisterForm(name, email, password) {
  if (!name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!email.trim()) return "Email is required.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
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
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const validationError = validateRegisterForm(name, email, password);
  if (validationError) {
    showMessage(validationError);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
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
      showMessage("");
      window.location.href = "index.html";
      return;
    }

    showMessage(data.message || "Invalid login");
  } catch (error) {
    showMessage("Unable to reach the server. Please try again.");
  }
}
