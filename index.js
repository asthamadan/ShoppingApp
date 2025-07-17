const express = require('express');
const app = express();
const port = 3000;

// Sample product catalog
const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'T-Shirt', price: 19.99, category: 'Clothing' },
  { id: 3, name: 'Coffee Maker', price: 49.99, category: 'Appliances' }
];

app.use(express.json());

// API to get products
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(port, () => {
  console.log(`Shopping app running at http://localhost:${port}`);
});