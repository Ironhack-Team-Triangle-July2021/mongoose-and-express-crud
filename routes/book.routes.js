const router = require("express").Router();

const Book = require("../models/Book.model");
const fileUploader = require('../config/cloudinary.config');


router.get('/books', (req, res, next) => {
    Book.find()
        .sort({createdAt: -1})
        .then( allTheBooksFromDB => {
            res.render("books-list", { books: allTheBooksFromDB })
        })
        .catch( error => {
            console.log('Error while getting the books from the DB: ', error);
            next(error);
        });
});


router.get('/books/create', (req, res, next) => {
    res.render("book-create");
});


router.post('/books/create', fileUploader.single('book-cover-image'), (req, res, next) => {
    const { title, author, description, rating } = req.body;
    const imageUrl = req.file.path;

    Book.create( { title, author, description, rating, imageUrl } )
        .then( bookFromDB => {
            console.log(`New book created: ${bookFromDB.title}.`);
            res.redirect('/books');
        })
        .catch( error => {
            console.log('Error saving book in DB: ', error);
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


router.get('/books/:bookId/edit', (req, res, next) => {
    const bookId = req.params.bookId; // you can also use object destructuring

    Book.findById(bookId)
        .then( bookToEdit => {
            res.render('book-edit', { book: bookToEdit });
        })
        .catch( error => {
            console.log('Error while updating book: ', error);
            next(error);
        });
});


router.post('/books/:bookId/edit', fileUploader.single('book-cover-image'), (req, res, next) => {
    const {bookId} = req.params;
    const { title, description, author, rating } = req.body;
    
    const bookData = { 
        title, 
        description, 
        author, 
        rating
    };

    // add imageUrl property (only if user provides image)
    if(req.file.path){
        bookData.imageUrl = req.file.path;
    }

    Book.findByIdAndUpdate(bookId, bookData, {new: true} )
        .then( updatedBook => {
            res.redirect(`/books/${updatedBook.id}`);
        })
        .catch( error => {
            console.log('Error updating book: ', error);
            next(error);
        });
});


router.post('/books/:bookId/delete', (req, res, next) => {
    const {bookId} = req.params;
    Book.findByIdAndDelete(bookId)
        .then( () => {
            res.redirect("/books");
        })
        .catch( error => {
            console.log('Error updating book: ', error);
            next(error);
        });
});


module.exports = router;