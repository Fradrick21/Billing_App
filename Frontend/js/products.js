const API = window.API_BASE_URL || "http://localhost:5000";

let editId = null;

async function loadProducts() {
  const table = document.getElementById("productTable");

  try {
    const res = await fetch(`${API}/products`);
    const data = await res.json().catch(() => []);

    table.innerHTML = "";

    if (!res.ok) {
      throw new Error(data.message || "Unable to load products");
    }

    if (!Array.isArray(data)) {
      throw new Error("Invalid products response");
    }

    if (!data.length) {
      table.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-6 text-center text-gray-500">No products found.</td>
        </tr>
      `;
      return;
    }

    data.forEach((p) => {
      const row = document.createElement("tr");
      row.className = "border-t";

      row.innerHTML = `
        <td class="px-3 py-2">${String(p.name || "").toUpperCase()}</td>
        <td class="px-3 py-2">${p.price}</td>
        <td class="px-3 py-2">${p.tax_percentage}</td>
        <td class="px-3 py-2">
          <button type="button" class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
          <button type="button" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </td>
      `;

      const [editButton, deleteButton] = row.querySelectorAll("button");
      editButton.addEventListener("click", () => editProduct(p.id, p.name, p.price, p.tax_percentage));
      deleteButton.addEventListener("click", () => deleteProduct(p.id));

      table.appendChild(row);
    });
  } catch (error) {
    table.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-6 text-center text-red-600">
          ${error.message || "Unable to load products"}
        </td>
      </tr>
    `;
  }
}

async function addProduct() {
  const name = document.getElementById("name").value.toUpperCase();
  const price = document.getElementById("price").value;
  const tax = document.getElementById("tax").value;

  try {
    const res = await fetch(
      editId ? `${API}/products/${editId}` : `${API}/products`,
      {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, tax_percentage: tax }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.message || "Unable to save product");
      return;
    }

    editId = null;
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("tax").value = "";
    loadProducts();
  } catch (error) {
    alert("Unable to reach the server. Please try again.");
  }
}

function editProduct(id, name, price, tax) {
  document.getElementById("name").value = String(name || "").toUpperCase();
  document.getElementById("price").value = price;
  document.getElementById("tax").value = tax;
  editId = id;
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Unable to delete product");
      return;
    }
    loadProducts();
  } catch (error) {
    alert("Unable to reach the server. Please try again.");
  }
}

loadProducts();
