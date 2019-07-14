const functions = require('firebase-functions');
var express = require('express');
const axios = require('axios');
const bodyParser = require("body-parser");
const cors = require('cors');
const line = require('@line/bot-sdk');
var ping = require('ping');
var host = 'gebtam.com';
const http = require('http');
require('dotenv').config();

const config = {
    channelAccessToken: '',
    channelSecret: ''
};

const client = new line.Client(config);

var app = express();
app.use(cors({
    origin: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.get('/', (req, res) => {
    ping.sys.probe(host, function (isAlive) {
        console.log(isAlive);
    });
    res.status(200).send('ok')
});


app.post('/api', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {
    console.log(event);
    if (event.type === 'message' && event.message.type === 'text') {
        handleMessageEvent(event);
    } else {
        return Promise.resolve(null);
    }
}

function handleMessageEvent(event) {
    var msg = {
        type: 'text',
        text: 'มีงานเข้า มีงานเข้า http://www.gebtam.com/ เข้าไม่ได้'
    };
    var msg2 = {
        type: 'text',
        text: 'ปกติ'
    };
    http.get('http://www.gebtam.com/', (resp) => {
        return;
    }).on("error", (err) => {
        return client.replyMessage(event.replyToken, msg);

    });
}


exports.bot = functions.https.onRequest(app);
// app.listen(3000, () => {
//     console.log('Server Listening on http://localhost:3000/');
// });
// app.listen(3000, () => {
//     console.log('hello')
// })