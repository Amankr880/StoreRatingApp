const db = require("../db");
const bcrypt = require("bcrypt");


// Create users
exports.createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!["admin", "user", "store_owner"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({ error: "Name must be 20–60 characters" });
  }

  const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
  if (!password || password.length < 8 || password.length > 16 || !passRegex.test(password)) {
    return res.status(400).json({ error: "Password must be 8-16 chars, with 1 uppercase and 1 special character." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (name, email, password, address, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [name, email, hashedPassword, address, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Email already exists" });
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "User created successfully!" });
  });
};


// Create Store
exports.createStore = (req, res) => {
    const { name, email, address, owner_id } = req.body;
  
    if (!name || name.length < 2 || name.length > 60) {
      return res.status(400).json({ error: "Store name must be 2–60 characters" });
    }
  
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid store email" });
    }
  
    if (!address || address.length > 400) {
      return res.status(400).json({ error: "Address must be less than 400 characters" });
    }
  
    // Check if owner exists and is a store_owner
    const checkOwner = `SELECT * FROM users WHERE id = ? AND role = 'store_owner'`;
    db.query(checkOwner, [owner_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(400).json({ error: "Invalid store_owner ID" });
  
      const insertQuery = `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`;
      db.query(insertQuery, [name, email, address, owner_id], (err2, result2) => {
        if (err2) {
          if (err2.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Store email already exists" });
          return res.status(500).json({ error: err2.message });
        }
        res.status(201).json({ message: "Store created successfully!" });
      });
    });
  };

  
  // Admin Dashboard
  exports.getDashboardStats = (req, res) => {
    const stats = {
      totalUsers: 0,
      totalStores: 0,
      totalRatings: 0
    };
  
    const userQuery = "SELECT COUNT(*) AS total FROM users";
    const storeQuery = "SELECT COUNT(*) AS total FROM stores";
    const ratingQuery = "SELECT COUNT(*) AS total FROM ratings";
  
    db.query(userQuery, (err, userResult) => {
      if (err) return res.status(500).json({ error: err.message });
  
      stats.totalUsers = userResult[0].total;
  
      db.query(storeQuery, (err2, storeResult) => {
        if (err2) return res.status(500).json({ error: err2.message });
  
        stats.totalStores = storeResult[0].total;
  
        db.query(ratingQuery, (err3, ratingResult) => {
          if (err3) return res.status(500).json({ error: err3.message });
  
          stats.totalRatings = ratingResult[0].total;
  
          res.json(stats);
        });
      });
    });
  };

  
  // list users
  exports.listUsers = (req, res) => {
    const { name, email, address, role } = req.query;
  
    let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
    const values = [];
  
    if (name) {
      query += " AND name LIKE ?";
      values.push(`%${name}%`);
    }
  
    if (email) {
      query += " AND email LIKE ?";
      values.push(`%${email}%`);
    }
  
    if (address) {
      query += " AND address LIKE ?";
      values.push(`%${address}%`);
    }
  
    if (role) {
      query += " AND role = ?";
      values.push(role);
    }
  
    db.query(query, values, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  };

  
  // list Store
  exports.listStores = (req, res) => {
    const { name, email, address } = req.query;
  
    let query = `
      SELECT s.id, s.name, s.email, s.address,
             ROUND(AVG(r.rating), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const values = [];
  
    if (name) {
      query += " AND s.name LIKE ?";
      values.push(`%${name}%`);
    }
  
    if (email) {
      query += " AND s.email LIKE ?";
      values.push(`%${email}%`);
    }
  
    if (address) {
      query += " AND s.address LIKE ?";
      values.push(`%${address}%`);
    }
  
    query += " GROUP BY s.id, s.name, s.email, s.address";
  
    db.query(query, values, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  };

  // get user details
  exports.getUserDetails = (req, res) => {
  const userId = req.params.id;

  const userQuery = `SELECT id, name, email, address, role FROM users WHERE id = ?`;

  db.query(userQuery, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];

    if (user.role !== 'store_owner') {
      return res.json(user);
    }

    const ratingQuery = `
      SELECT ROUND(AVG(r.rating), 1) AS average_rating
      FROM stores s
      JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
    `;

    db.query(ratingQuery, [userId], (err2, ratingResults) => {
      if (err2) return res.status(500).json({ error: err2.message });

      user.average_rating = ratingResults[0].average_rating || null;
      res.json(user);
    });
  });
};

  