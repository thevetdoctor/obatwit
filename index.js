const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const db = require('./models/index');
const routeHandler = require('./routes/index');
require('dotenv').config();

const port = process.env.PORT || 4000;
const app = express();

app.use(morgan('combined'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

routeHandler(app);

// Handles all errors
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(err.status || 400).send({ success: false });
    }
    if (err) console.log(err);
    return res
    .status(err.status || 400)
    .send({ success: false, message: err.message });
});

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to Twitee'
    });
});

app.listen(port, () => {
    console.log('Server running @ port: ', port);
})