const API = (typeof window !== "undefined" && window.API_BASE_URL) || (
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://billing-app-hnbf.onrender.com"
);

let editId = null;

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const data = await res.json();

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${String(p.name || "").toUpperCase()}</td>
        <td>${p.price}</td>
        <td>${p.tax_percentage}</td>
        <td>
          <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, ${p.tax_percentage})">✏️</button>
          <button onclick="deleteProduct(${p.id})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

async function addProduct() {
  const name = document.getElementById("name").value.toUpperCase();
  const price = document.getElementById("price").value;
  const tax = document.getElementById("tax").value;

  if (editId) {
    await fetch(`${API}/products/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, tax_percentage: tax })
    });
    editId = null;
  } else {
    await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, tax_percentage: tax })
    });
  }

  loadProducts();
}

function editProduct(id, name, price, tax) {
  document.getElementById("name").value = String(name || "").toUpperCase();
  document.getElementById("price").value = price;
  document.getElementById("tax").value = tax;
  editId = id;
}

async function deleteProduct(id) {
  await fetch(`${API}/products/${id}`, { method: "DELETE" });
  loadProducts();
}

loadProducts();
