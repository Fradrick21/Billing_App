const API = window.API_BASE_URL || "http://localhost:5000";

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toLocaleString();
}

async function loadReport() {
  const container = document.getElementById("result");
  const details = document.getElementById("reportDetails");

  try {
    const date = document.getElementById("date").value;
    const invoiceNo = document.getElementById("invoiceNo").value.trim();

    const params = new URLSearchParams();
    if (invoiceNo) params.set("invoiceNo", invoiceNo);
    if (date) params.set("date", date);

    const query = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`${API}/reports${query}`);
    const rows = await res.json().catch(() => []);

    if (!res.ok) {
      throw new Error(rows.message || "Unable to load reports");
    }

    if (!Array.isArray(rows)) {
      throw new Error("Invalid reports response");
    }

    if (!rows.length) {
      container.textContent = "No bills found.";
      details.innerHTML = "";
      return;
    }

    const bills = new Map();

    rows.forEach((row) => {
      if (!bills.has(row.bill_id)) {
        bills.set(row.bill_id, {
          bill_id: row.bill_id,
          created_at: row.created_at,
          total_amount: row.total_amount,
          total_tax: row.total_tax,
          grand_total: row.grand_total,
          items: [],
        });
      }

      if (row.item_id) {
        bills.get(row.bill_id).items.push(row);
      }
    });

    let grandTotal = 0;
    bills.forEach((bill) => {
      grandTotal += Number(bill.grand_total || 0);
    });

    container.textContent = `Bills Loaded: ${bills.size} | Grand Total: ${formatCurrency(grandTotal)}`;

    details.innerHTML = "";

    bills.forEach((bill) => {
      const rowsHtml = bill.items
        .map(
          (item) => `
              <tr class="border-t">
                <td class="px-3 py-2">${item.product_name || "-"}</td>
                <td class="px-3 py-2 text-center">${item.quantity || 0}</td>
                <td class="px-3 py-2 text-right">${formatCurrency(item.price)}</td>
                <td class="px-3 py-2 text-center">${Number(item.tax_rate || 0)}%</td>
                <td class="px-3 py-2 text-right">${formatCurrency(item.tax)}</td>
                <td class="px-3 py-2 text-right">${formatCurrency(item.total)}</td>
              </tr>
            `
        )
        .join("");

      details.innerHTML += `
        <div class="border rounded-lg p-4 mb-4 bg-white shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <div>
              <h3 class="font-bold text-lg">Invoice #${bill.bill_id}</h3>
              <p class="text-sm text-gray-600">${formatDate(bill.created_at)}</p>
            </div>
            <div class="text-sm md:text-right">
              <div>Subtotal: ${formatCurrency(bill.total_amount)}</div>
              <div>Tax: ${formatCurrency(bill.total_tax)}</div>
              <div class="font-semibold">Grand Total: ${formatCurrency(bill.grand_total)}</div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-3 py-2 text-left">Product</th>
                  <th class="px-3 py-2 text-center">Qty</th>
                  <th class="px-3 py-2 text-right">Price</th>
                  <th class="px-3 py-2 text-center">Tax %</th>
                  <th class="px-3 py-2 text-right">Tax Amt</th>
                  <th class="px-3 py-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });
  } catch (error) {
    container.textContent = error.message || "Unable to load reports";
    details.innerHTML = "";
  }
}
