const router = require("express").Router();

const userRouter = require("../routes/user");

// User Route
router.use("/api/users", userRouter);

module.exports = router;