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

app.post('/subscribe', CORS(), (req, res) => {
    const subscription = req.body;
    // const subscription = {
    //     endpoint: 'https://fcm.googleapis.com/fcm/send/fs3lFWhQdFo:APA91bHJpJiI5XdMbaN5KTzJ5FN82A8j_Tmi8ZT-uFNzMYwOB-_K73dOArc1RJXj2NjnRAhDY3iBRU_XllMxcN6gZqVvifyCz79wiz5uUSQafWD8J7GtGjvoCMYKgjgjpNzaK-GfaHU2', 
    //     expirationTime: null, 
    //     options: 'PushSubscriptionOptions', 
    //     keys: {
    //         auth: "9ipCHxYlDxb8YlOBZrIhvA",
    //         p256dh: "BFKQTVM7nqpPD2vU-t4XNDNNl61saWtR1SZChHNAPmMv9znFqT2ipxD7spkulqpATPN-0hWgPKnvMTzU5wbNsEU"
    //     }
    // };
 
    res.status(201).json({message: 'Notification sent'}); 

    // const payload = JSON.stringify({ title: `Push Twitee from server @ ${req.protocol}://${req.hostname}:${port}` });
    const payload = JSON.stringify({ title: 'Buzz' });
    console.log('server push response')
    webPush.sendNotification(subscription, payload).catch(error => console.log(error.message));
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