const express = require("express");
const router = express.Router();
const adminsterController = require("../controller/administerController");

router.route("/add").get(adminsterController.addFamilyPage).post(adminsterController.addFamily);  
router.get("/add/:fid", adminsterController.addFamilyPage);
router.route("/edit/student/:id").get(adminsterController.editStudentPage).put(adminsterController.editPeople).delete(adminsterController.deletePeople);
router.route("/edit/parent/:id").get(adminsterController.editParentPage).put(adminsterController.editPeople).delete(adminsterController.deletePeople); 
module.exports = router;