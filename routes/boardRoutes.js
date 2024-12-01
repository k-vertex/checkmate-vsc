const express = require("express");
const router = express.Router();
const boardController = require("../controller/boardController");

router.route("/").get(boardController.getAllArticle);  
router.route("/:articleID").get(boardController.getArticle); 
router.route("/comment/:articleID").get(boardController.getArticleComment); 
module.exports = router;