const express = require("express")
const app = express()
const path = require('path');
const config = require("./config/config.json")
const routing = require('./routes/index');
var io = require('socket.io')(6000);
var users = {};
const mongoose = require("mongoose")
 

mongoose.connect(config.mongoString, { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to mongodb");
});


app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", routing);


  
const server = app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}!`);
});



io.on('connection', socket => {
    console.log(`Client Connected : ${socket.id} `)
    socket.on('new-user', data => {
        users[socket.id] = { roomId: data.roomid, name: data.name }
        console.log(`new user has connected, incoming data: ${data}`);
    });
});


