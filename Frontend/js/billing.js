const API = "http://localhost:5000";
const invoiceNo = `INV-${String(Date.now()).slice(-6)}`;

let products = [];
let cart = [];

function money(value) {
  return `\u20B9 ${Number(value || 0).toFixed(2)}`;
}

function updateInvoiceMeta() {
  const noLabel = document.getElementById("invoiceNoLabel");
  const dateLabel = document.getElementById("invoiceDateLabel");

  if (noLabel) noLabel.textContent = invoiceNo;
  if (dateLabel) dateLabel.textContent = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  products = await res.json();

  const select = document.getElementById("product");
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select product";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  products.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = String(p.name || "").toUpperCase();
    select.appendChild(opt);
  });
}

function addItem() {
  const id = document.getElementById("product").value;
  const qty = Number(document.getElementById("qty").value);
  const product = products.find((x) => x.id == id);

  if (!product || !qty || qty <= 0) return;

  const price = Number(product.price) || 0;
  const taxRate = Number(product.tax_percentage) || 0;
  const subtotal = price * qty;
  const tax = subtotal * (taxRate / 100);
  const lineTotal = subtotal + tax;

  cart.push({
    product_id: product.id,
    name: String(product.name || "").toUpperCase(),
    quantity: qty,
    price,
    taxRate,
    tax,
    total: subtotal,
    lineTotal,
  });

  document.getElementById("qty").value = 1;
  render();
}

function removeItem(index) {
  cart.splice(index, 1);
  render();
}

function render() {
  const table = document.getElementById("billTable");
  const subtotalValue = document.getElementById("subtotalValue");
  const taxValue = document.getElementById("taxValue");
  const grandTotal = document.getElementById("grandTotal");

  table.innerHTML = "";

  let subtotal = 0;
  let tax = 0;
  let total = 0;

  if (!cart.length) {
    table.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-10 text-center text-slate-400 italic">
          No items added yet
        </td>
      </tr>
    `;
  } else {
    cart.forEach((item, index) => {
      table.innerHTML += `
        <tr class="border-t border-rose-100">
          <td class="px-4 py-3">
            <div class="font-medium text-slate-800">${item.name}</div>
          </td>
          <td class="px-4 py-3 text-center text-slate-700">${item.quantity}</td>
          <td class="px-4 py-3 text-right text-slate-700">${money(item.price)}</td>
          <td class="px-4 py-3 text-right text-slate-700">${item.taxRate}%</td>
          <td class="px-4 py-3 text-right font-semibold text-slate-900">${money(item.lineTotal)}</td>
          <td class="px-4 py-3 text-center">
            <button onclick="removeItem(${index})" class="text-rose-600 font-bold text-lg leading-none">&times;</button>
          </td>
        </tr>
      `;

      subtotal += item.total;
      tax += item.tax;
      total += item.lineTotal;
    });
  }

  subtotalValue.textContent = money(subtotal);
  taxValue.textContent = money(tax);
  grandTotal.textContent = `Total: ${money(total)}`;
}

async function generateBill() {
  let total = 0;
  let tax = 0;

  cart.forEach((item) => {
    total += item.total;
    tax += item.tax;
  });

  const grandTotal = total + tax;

  await fetch(`${API}/bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cart,
      total,
      tax,
      grandTotal,
    }),
  });

  alert(`Bill Saved! Invoice ${invoiceNo}`);
  cart = [];
  render();
}

updateInvoiceMeta();
loadProducts();
render();
