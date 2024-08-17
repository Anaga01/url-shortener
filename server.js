const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrlModel');
const crypto=require('crypto');
// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find();
        res.render('index', { shortUrls, message: null });
    } catch (error) {
        console.error('Error fetching short URLs:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;

    const shortUrl = crypto.randomBytes(4).toString('hex');

    try {
        const existingUrl = await ShortUrl.findOne({ longUrl});

        if (existingUrl) {
            // URL already exists, redirect with a message
            const shortUrls = await ShortUrl.find();
            res.render('index', {
                shortUrls,
                message: 'This URL has already been shortened!'
            });
        } else {
            // Create a new short URL
            await ShortUrl.create({ longUrl,shortUrl });
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    try {
        // Find the URL by shortUrl and increment the clicks
        const url = await ShortUrl.findOneAndUpdate(
            { shortUrl },
            { $inc: { clicks: 1 } },  // Increment the clicks count
            { new: true }  // Return the updated document
        );

        if (url) {
            res.redirect(url.longUrl);  // Redirect to the long URL
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Error finding URL:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running');
});
