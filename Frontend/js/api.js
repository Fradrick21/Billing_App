const API = 'http://localhost:5000';

export const getProducts = () => fetch(`${API}/products`).then(res => res.json());
export const createBill = (data) => fetch(`${API}/bills`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});