const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/attendanceController");

router.post("/device", attendanceController.setDeviceAttendance);
router.post("/manual", attendanceController.setManualAttendance);
router.get("/", attendanceController.getAttendanceStatus);

router.route("/:studentID").get(attendanceController.getAttendanceStatus2).post(attendanceController.updateAttendanceStatus);

module.exports = router;