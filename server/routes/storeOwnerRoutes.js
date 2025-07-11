const express = require("express");
const router = express.Router();
const storeOwnerController = require("../controllers/storeOwnerController");
const authenticate = require("../middlewares/authenticateUser");

router.get("/dashboard", authenticate, storeOwnerController.getStoreRatings);

module.exports = router;
