const mongoose = require('mongoose');
const Book = require('../models/Book.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/library-project';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


const books = require('./books-seed-data')

Book.create(books)
  .then(booksFromDB => {
    console.log(`Created ${booksFromDB.length} books`);
    mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating books from the DB: ${err}`));
