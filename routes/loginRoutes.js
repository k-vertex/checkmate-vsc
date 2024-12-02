const express = require("express");
const router = express.Router();
const loginController = require("../controller/loginController");
const adminsterController = require("../controller/administerController");

router.route("/").get(loginController.showLoginPage).post(loginController.handleLogin);  
router.get("/main", loginController.isAuthenticated, adminsterController.showAdminPage); 
router.get("/main/search", adminsterController.search);
router.post("/logout", loginController.logout);

module.exports = router;