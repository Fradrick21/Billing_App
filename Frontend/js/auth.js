const API = (typeof window !== "undefined" && window.API_BASE_URL) || (
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://billing-app-hnbf.onrender.com"
);

// 📝 REGISTER
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/api/register`, {   // ✅ FIXED
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered!");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Register failed");
  }
}

// 🔐 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/api/login`, {   // ✅ FIXED
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", "loggedin");
    window.location.href = "index.html";
  } else {
    alert(data.message || "Invalid login");
  }
}