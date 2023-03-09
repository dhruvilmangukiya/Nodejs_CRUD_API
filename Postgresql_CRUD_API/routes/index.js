const router = require("express").Router();

const userRouter = require("../routes/user");
const bookRouter = require("../routes/book");

// User Route
router.use("/api/users", userRouter);

// Book Route
router.use("/api/books", bookRouter);

module.exports = router;