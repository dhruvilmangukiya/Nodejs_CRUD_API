const express = require('express');
const book = require('../controllers/book');

const router = express.Router();

router.post("/addBook", book.createBook);

router.get("/getAllBook",book.getBooksDetails);

router.get("/oneToMany",book.oneToMany);

router.get("/paginationBook",book.paginationBook);

router.get("/:id",book.getBookById);

router.patch("/:id",book.updateBookDetails);

router.delete("/:id",book.deleteBookDetails);

module.exports = router;