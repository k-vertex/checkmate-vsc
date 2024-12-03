const express = require("express");
const router = express.Router();
const boardController = require("../controller/boardController");

router.route("/all").get(boardController.getAllArticle);  
router.route("/").get(boardController.getArticle); 
router.route("/comment").get(boardController.getArticleComment); 
module.exports = router;