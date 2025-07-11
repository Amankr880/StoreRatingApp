const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticateUser");
const db = require('../db');

router.get("/stores", authenticate, userController.getStoresForUser);

router.post("/rate", authenticate, userController.submitOrUpdateRating);

// router.get("/me", authenticate, (req, res) => {
//   const userId = req.user.id;
//   db.query("SELECT name FROM users WHERE id = ?", [userId], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (results.length === 0) return res.status(404).json({ error: "User not found" });
//     res.json({ name: results[0].name });
//   });
// });

router.get("/me", authenticate, userController.getMe);

router.post("/update-password", authenticate, userController.updatePassword);

module.exports = router;
