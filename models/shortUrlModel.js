const mongoose = require('mongoose');
//const shortId = require('shortid');

// Define the schema
const shorturlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        unique: true // Ensures that long URLs are unique
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true, // Ensures that short URLs are unique
        //default: shortId.generate // Generates a unique short ID by default
        default:"hello"
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

// Create the model
const ShortUrl = mongoose.model('ShortUrl', shorturlSchema);

module.exports = ShortUrl;
