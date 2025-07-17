const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());

const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'T-Shirt', price: 19.99, category: 'Clothing' },
  { id: 3, name: 'Coffee Maker', price: 49.99, category: 'Appliances' }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

describe('Shopping App API', () => {
  test('GET /api/products returns product list', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(products);
  });
});