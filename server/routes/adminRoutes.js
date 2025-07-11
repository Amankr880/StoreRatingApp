const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

router.post("/create-user", authenticateAdmin, adminController.createUser);

router.post("/create-store", authenticateAdmin, adminController.createStore);

router.get("/dashboard", authenticateAdmin, adminController.getDashboardStats);

router.get("/users", authenticateAdmin, adminController.listUsers);

router.get("/stores", authenticateAdmin, adminController.listStores);

router.get('/user/:id', authenticateAdmin, adminController.getUserDetails);



module.exports = router;
