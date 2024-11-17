const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/attendanceController");

router.post("/device", attendanceController.setDeviceAttendance);
router.post("/manual", attendanceController.setManualAttendance);

module.exports = router;