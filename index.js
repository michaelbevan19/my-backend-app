// backend/index.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// Allow JSON request bodies
app.use(express.json());

// Allow requests from frontend (CORS)
app.use(cors());

// 1) Create MySQL connection (local DB)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // change if your user is different
  password: "sql@1234",          // add your password if you have one
  database: "simple_app" // the DB we created earlier
});

// 2) Connect to MySQL
db.connect(err => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// 3) GET /api/items - get all items
app.get("/api/items", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) {
      console.error("Error fetching items:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results);
  });
});

// 4) POST /api/items - add new item
app.post("/api/items", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  db.query("INSERT INTO items (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      console.error("Error adding item:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.status(201).json({ id: result.insertId, name });
  });
});

// 5) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
