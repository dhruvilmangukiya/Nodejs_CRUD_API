const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.post("/addUser", user.signUp);

router.get("/getAllUser", user.getUsersDetails);

router.get("/:id", user.getUserById);

router.put("/updateUser/:id", user.updateUserDetails);

router.delete("/:id", user.deleteUserDetails);

module.exports = router;