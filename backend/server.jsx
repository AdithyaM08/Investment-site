require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Username or email already exists' });
        }
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  } catch {
    res.status(500).json({ message: 'Error hashing password' });
  }
});

app.post('/api/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Missing username/email or password' });
  }
  const sql = 'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
  db.query(sql, [usernameOrEmail, usernameOrEmail], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ message: 'No user found, please register' });
    }
    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      res.json({ message: 'Login successful', userId: user.id, username: user.username });
    } catch {
      res.status(500).json({ message: 'Error checking password' });
    }
  });
});

app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT id, username, email FROM users WHERE id = ? LIMIT 1';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

app.get('/api/stocks', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  const status = (req.query.status || '').toLowerCase();

  let sql = 'SELECT id, name, symbol, price, stock_status FROM stocks';
  const params = [];

  if (search && status) {
    sql += ' WHERE (LOWER(name) LIKE ? OR LOWER(symbol) LIKE ?) AND LOWER(stock_status) = ?';
    params.push(`%${search}%`, `%${search}%`, status);
  } else if (search) {
    sql += ' WHERE LOWER(name) LIKE ? OR LOWER(symbol) LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  } else if (status) {
    sql += ' WHERE LOWER(stock_status) = ?';
    params.push(status);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }
    res.json(results);
  });
});

app.get('/api/stocks/:id', (req, res) => {
  const stockId = req.params.id;
  const sql = 'SELECT id, name, symbol, price, stock_status FROM stocks WHERE id = ? LIMIT 1';
  db.query(sql, [stockId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Stock not found' });
    res.json(results[0]);
  });
});

app.post('/api/portfolio/add', (req, res) => {
  const { user_id, stock_id, quantity, purchase_price } = req.body;
  if (!user_id || !stock_id || !quantity || !purchase_price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const sql = 'INSERT INTO portfolio (user_id, stock_id, quantity, purchase_price) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, stock_id, quantity, purchase_price], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Purchase recorded', purchaseId: result.insertId });
  });
});

app.get('/api/portfolio/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT s.name, s.symbol, s.price, p.quantity, p.purchase_price
    FROM portfolio p
    JOIN stocks s ON p.stock_id = s.id
    WHERE p.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }
    res.json(results);
  });
});
app.delete('/api/portfolio/:id', (req, res) => {
  const portfolioId = req.params.id;
  const sql = 'DELETE FROM portfolio WHERE id = ?';
  db.query(sql, [portfolioId], (err, result) => {
    if (err) {
      console.error('Delete portfolio error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Portfolio entry not found' });
    res.json({ message: 'Stock sold (portfolio entry deleted) successfully' });
  });
});





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
