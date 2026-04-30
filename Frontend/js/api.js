const API = window.API_BASE_URL || "http://localhost:5000";

function getProducts() {
  return fetch(`${API}/products`).then((res) => res.json());
}

function createBill(data) {
  return fetch(`${API}/bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
