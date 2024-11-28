const express = require("express");
const router = express.Router();
const upload = require("../util/fileUpload");
const uploadController = require("../controller/uploadController");

router.route("/").post(upload.single("file"), uploadController.uploadBoard);  

module.exports = router;