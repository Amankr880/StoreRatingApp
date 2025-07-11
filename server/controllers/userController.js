const db = require("../db");


// get Stores 
exports.getStoresForUser = (req, res) => {
  const { name, address } = req.query;
  const userId = req.user.id; // from token

  let query = `
    SELECT s.id, s.name, s.address,
           ROUND(AVG(r.rating), 1) AS average_rating,
           ur.rating AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
    WHERE 1=1
  `;

  const values = [userId];

  if (name) {
    query += " AND s.name LIKE ?";
    values.push(`%${name}%`);
  }

  if (address) {
    query += " AND s.address LIKE ?";
    values.push(`%${address}%`);
  }

  query += " GROUP BY s.id, ur.rating";

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


// submit ratiing

exports.submitOrUpdateRating = (req, res) => {
    const userId = req.user.id;
    const { store_id, rating } = req.body;
  
    if (!store_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid store or rating value (1–5 required)" });
    }
  
    // Check if the user has already rated this store
    const checkQuery = "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?";
    db.query(checkQuery, [userId, store_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length > 0) {
        // Update existing rating
        const updateQuery = "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?";
        db.query(updateQuery, [rating, userId, store_id], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Rating updated successfully!" });
        });
      } else {
        // Insert new rating
        const insertQuery = "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)";
        db.query(insertQuery, [userId, store_id, rating], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: "Rating submitted successfully!" });
        });
      }
    });
  };
  
// get me
  exports.getMe = (req, res) => {
  const userId = req.user.id;

  db.query("SELECT name FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ name: results[0].name });
  });
};

// update password
exports.updatePassword =  async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8 || newPassword.length > 16) {
    return res.status(400).json({ error: "New password must be 8–16 characters." });
  }

  db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, results[0].password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE users SET password = ? WHERE id = ?", [hashedNew, userId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "✅ Password updated successfully!" });
    });
  });
};