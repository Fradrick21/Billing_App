window.API_BASE_URL =
  window.API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://billing-backend-h1f5.onrender.com");
