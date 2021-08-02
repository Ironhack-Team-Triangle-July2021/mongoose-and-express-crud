const router = require("express").Router();

const Book = require("../models/Book.model");



router.get('/books', (req, res, next) => {
    Book.find()
        .then( allTheBooksFromDB => {
            res.render("books-list", { books: allTheBooksFromDB })
        })
        .catch( error => {
            console.log('Error while getting the books from the DB: ', error);
            next(error);
        });
});


router.get('/books/:bookId', (req, res, next) => {

    const { bookId } = req.params;

    Book.findById(bookId)
        .then( theBook => {
            res.render("book-details.hbs", {book: theBook} );
        })
        .catch( error => {
            console.log('Error while retrieving book details: ', error);
            next(error);
        });
});



module.exports = router;