const { Schema, model } = require('mongoose');

const bookSchema = new Schema(
    {
        title: String,
        description: String,
        author: String,
        imageUrl: String,
        rating: Number
    },
    {
        timestamps: true
    }
);

module.exports = model('Book', bookSchema);