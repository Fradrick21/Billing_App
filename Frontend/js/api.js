const API = (typeof window !== "undefined" && window.API_BASE_URL) || (
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://billing-app-hnbf.onrender.com"
);

export const getProducts = () =>
  fetch(`${API}/products`).then(res => res.json());

export const createBill = (data) =>
  fetch(`${API}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
