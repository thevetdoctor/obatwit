const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const db = require('./models/index');
const routeHandler = require('./routes/index');
const path = require('path');
const webPush = require('web-push');
const redisClient = require('redis');
require('dotenv').config();
const CORS = require('cors');
const Push = require('./models').push;

// const client = redisClient.createClient();
const port = process.env.PORT || 4000;
const app = express();

app.use(CORS());
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

app.post('/subscribe', CORS(), async (req, res) => {
    const subscription = req.body;
    
    console.log(req.body)
    if(!req.body.endpoint) return res.status(400).json({message: 'Endpoint not supplied'})
    const pushExist = await Push.findOne({where: {text: JSON.stringify(req.body)}});
    // console.log(pushExist)
    if(!pushExist) {
        const randomPost = await Push.create({text: JSON.stringify(req.body)});
        res.status(201).json({message: 'Subscription received'}); 
        const payload = JSON.stringify({ title: 'Buzz', message: 'Subscription received'});
        console.log('server push response')
        webPush.sendNotification(subscription, payload).catch(error => console.log(error.message));
    } else {
        res.status(200).json({message: 'Subscription exist'});
    }
});

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