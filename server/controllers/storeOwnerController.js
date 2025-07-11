const db = require("../db");

exports.getStoreRatings = (req, res) => {
  const ownerId = req.user.id;

  // Get store owned by this owner
  const storeQuery = `SELECT id, name FROM stores WHERE owner_id = ?`;

  db.query(storeQuery, [ownerId], (err, storeResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (storeResults.length === 0) return res.status(404).json({ message: "No store assigned to this owner" });

    const store = storeResults[0];

    const ratingQuery = `
      SELECT u.name AS user_name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;

    const averageQuery = `
      SELECT ROUND(AVG(rating), 2) AS average_rating FROM ratings WHERE store_id = ?
    `;

    db.query(ratingQuery, [store.id], (err2, ratings) => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.query(averageQuery, [store.id], (err3, avgResult) => {
        if (err3) return res.status(500).json({ error: err3.message });

        const averageRating = avgResult[0].average_rating || 0;

        res.json({
          store: {
            id: store.id,
            name: store.name,
            average_rating: averageRating,
            ratings: ratings
          }
        });
      });
    });
  });
};
