const express = require("express");
const router = express.Router();
const adminsterController = require("../controller/administerController");

router.get("/add", adminsterController.addFamilyPage);  

module.exports = router;