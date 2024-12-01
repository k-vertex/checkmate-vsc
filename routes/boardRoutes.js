const express = require("express");
const router = express.Router();
const boardController = require("../controller/boardController");

router.route("/").get(boardController.getArticle);  
module.exports = router;