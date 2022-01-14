const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const db = require('./models/index');
const routeHandler = require('./routes/index');
const path = require('path');
const webPush = require('web-push');
require('dotenv').config();

const port = process.env.PORT || 4000;
const app = express();

app.use(morgan('combined'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
  
    next();
})
app.use(express.static(path.join(__dirname, './ui/build')));
// app.use(express.static(path.join(__dirname, 'client')));

const {PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY} = process.env;

webPush.setVapidDetails('mailto:thevetdoctor@gmail.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

routeHandler(app);

// app.post('/subscribe', (req, res) => {
//     const subscription = req.body;

//     res.status(201).json({});

//     const payload = JSON.stringify({ title: `Push Twitee from server @ ${req.protocol}://${req.hostname}:${port}` });
//     console.log('server push response')
//     webPush.sendNotification(subscription, payload).catch(error => console.log(error));
// });

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
    // return res.status(200).json({
    //     message: 'Welcome to Twitee'
    // });
    res.sendFile(path.join(__dirname, './ui/build/', 'index.html'));
});

app.listen(port, () => {
    console.log('Server running @ port: ', port);
})