const express = require("express");
const http = require('http');
const app = express()
const path = require('path');
const config = require("./config/config.json")
const routing = require('./routes/index');
const cors = require('cors');
var users = {};
const mongoose = require("mongoose");
var server = http.createServer(app);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
      allowedHeaders:["secretHeader"],
      credentials: true
    }
});
server.listen(80);

mongoose.connect(config.mongoString, { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to mongodb");
});

app.use(cors());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/client", express.static(path.join(__dirname, "node_modules")));
app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "ejs");

app.use("/", routing);



io.on('connection', socket => {
    socket.on('new-user', data => {
        users[socket.id] = { roomId: data.roomId, name: data.name }
        console.log(`new user has connected, incoming data: ${data.roomId}`);
    });

    socket.on('message', data => {
        console.log(`${data.message} From user: ${socket.id} in room: ${users[socket.id].roomId}`);
        io.sockets.emit(`chat-message-${users[socket.id].roomId}`, { message: data.message, name: users[socket.id].name});
    });

    socket.on(`start-video-play`, data => {
        io.sockets.emit(`start-video-play-${users[socket.id].roomId}`, { video: data.video });
    })
});


