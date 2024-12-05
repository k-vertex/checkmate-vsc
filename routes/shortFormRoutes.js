const express = require("express");
const router = express.Router();
const shortFormController = require("../controller/shortFormController");

router.route("/:videoPath").get(shortFormController.loadViedo);
router.route("/").get(shortFormController.getVideoList);
module.exports = router;