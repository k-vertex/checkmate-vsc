const express = require("express");
const router = express.Router();
const adminsterController = require("../controller/administerController");

router.get("/add", adminsterController.addFamilyPage);  
router.post("/add", adminsterController.addFamily);
router.get("/add/:fid", adminsterController.addFamilyPage);

module.exports = router;