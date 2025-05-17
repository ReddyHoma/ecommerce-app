const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// POST /products - Add new product
app.post('/products', async (req, res) => {
  const { name, price, description, image_url } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting product:', err.message);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// GET /products — return products
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /products/search?q=keyword
app.get('/products/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const keywords = q.toLowerCase().split(/\s+/).filter(Boolean); // break query into words

  try {
    const result = await pool.query('SELECT * FROM products');
    const products = result.rows;

    // Filter products by checking if any keyword exists in name or description
    const filtered = products.filter(product => {
      const combinedText = `${product.name} ${product.description}`.toLowerCase();
      return keywords.some(keyword => combinedText.includes(keyword));
    });

    res.json(filtered);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
