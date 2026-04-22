const API = (typeof window !== "undefined" && window.API_BASE_URL) || (
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://billing-app-hnbf.onrender.com"
);

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      alert("Registered!");
      window.location.href = "login.html";
      return;
    }

    alert(data.message || "Register failed");
  } catch (error) {
    alert("Unable to reach the server. Please try again.");
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      localStorage.setItem("token", "loggedin");
      window.location.href = "index.html";
      return;
    }

    alert(data.message || "Invalid login");
  } catch (error) {
    alert("Unable to reach the server. Please try again.");
  }
}
