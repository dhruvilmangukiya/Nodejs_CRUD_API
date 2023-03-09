const express = require('express');
const user = require('../controllers/user');

const router = express.Router();

router.post("/addUser", user.signUp);

router.get("/getAllUsers",user.getUsersDetails);

router.get("/:id",user.getUserById);

router.put("/:id",user.updateUserDetails);

router.delete("/:id",user.deleteUserDetails);

module.exports = router;