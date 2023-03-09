const express = require('express');
const router = express.Router();
const book = require('../controllers/book');

router.post("/addBook", book.createBook);

router.get("/getAllBooks",book.getBooksDetails);

router.get("/oneToMany",book.oneToMany);

router.get("/paginationBook",book.paginationBook);

router.get("/:id",book.getBookById);

router.patch("/:id",book.updateBookDetails);

router.delete("/:id",book.deleteBookDetails);

module.exports = router;