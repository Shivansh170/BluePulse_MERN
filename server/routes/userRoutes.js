const { registerUser, userLogin } = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.post("/createUser", registerUser);
router.post("/loginUser", userLogin);

module.exports = router;
