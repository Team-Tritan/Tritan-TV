const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const config = require("./config/config.json");
const routing = require("./routes/index");
const cors = require("cors");
const rooms = require("./models/room-data");
var users = {};
const mongoose = require("mongoose");
var server = http.createServer(app);
let connectedUsers = new Map();
let connectedQueue = new Map();
let roomQueue = new Map();
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["secretHeader"],
    credentials: true,
  },
});

function ownershipCheck(room, user, socketId) {
  if (room.masterUser == "") {
    room.masterUser = socketId;
    roomQueue.set(user.room, room);
  }
}

function queueCheck(roomid, socketId) {
  if (!roomQueue.has(roomid)) {
    roomQueue.set(roomid, {
      queue: ["https://www.youtube.com/watch?v=PsBPPkt0Rbg&ab_channel=LXNRKD"],
      masterUser: socketId,
      currentTime: 0.0,
    });
  }

  return roomQueue.get(roomid);
}

server.listen(3000);

mongoose
  .connect(config.mongoString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb");
  });

app.use(cors());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/client", express.static(path.join(__dirname, "node_modules")));
app.set("views", path.join(__dirname, "/Views"));
app.set("view engine", "ejs");

app.use("/", routing);

io.of("/chat").on("connection", (socket) => {
  socket.on("join-chat", (data) => {
    console.log(`New user requested to join room ${data.roomId}`);
    if (data.roomId) {
      socket.join(data.roomId);
      connectedUsers.set(socket.id, { name: data.name, room: data.roomId });
      io.of("/chat")
        .in(data.roomId)
        .emit(`system-log`, `${data.name} has joined the room.`);
    }
  });

  socket.on("message", (data) => {
    let user = connectedUsers.get(socket.id);

    io.of("/chat")
      .in(user.room)
      .emit(`chat-message`, { message: data.message, name: user.name });
  });
});

io.of("/videos").on("connection", (socket) => {
  socket.on("join-room-queue", (data) => {
    if (data.roomId) {
      socket.join(data.roomId);
      let room = queueCheck(data.roomId, socket.id);
      connectedQueue.set(socket.id, { room: data.roomId });
      let user = connectedQueue.get(socket.id);
      //let room = roomQueue.get(user.room);
      ownershipCheck(room, user, socket.id);
    }
  });

  socket.on("user-video-sync", (data) => {
    let user = connectedQueue.get(socket.id);
    if (user) {
      let queue = queueCheck(user.room, socket.id);

      io.of("/videos")
        .in(user.room)
        .emit("client-video-sync", { queue: queue });
    }
  });

  socket.on("user-time-sync", (data) => {
    let user = connectedQueue.get(socket.id);
    console.log(`User Is time syncing ${socket.id}`);
    if (user) {
      let room = queueCheck(user.room, socket.id);
      console.log(room.masterUser);
      io.of("/videos").to(room.masterUser).emit("send-time-sync", {});
    }
  });

  socket.on("server-time-sync", (data) => {
    io.of("/videos").emit("client-time-sync", {
      time: data.time,
      state: data.state,
    });
  });

  socket.on("advance-queue", (data) => {
    let user = connectedQueue.get(socket.id);
    if (user) {
      let room = queueCheck(user.room, socket.id);

      ownershipCheck(room, socket.id);

      if (socket.id == room.masterUser) {
        room.queue.splice(0, 1);
        roomQueue.set(user.room, room);
        io.of("/videos")
          .in(user.room)
          .emit("client-video-sync", { queue: room });
      }
    }
  });

  socket.on("user-add-to-queue", (data) => {
    let user = connectedQueue.get(socket.id);
    if (user) {
      let room = queueCheck(user.room, socket.id);

      ownershipCheck(room, socket.id);

      if (data.video) {
        room.queue.push(data.video);
      }
    }
  });

  socket.on("disconnect", () => {
    let user = connectedQueue.get(socket.id);
    if (user) {
      let room = queueCheck(user.room, socket.id);

      if (socket.id == room.masterUser) {
        room.masterUser = "";
        roomQueue.set(user.room, room);
      }
      connectedQueue.delete(socket.id);
      console.log("Client disconnected!");
    }
  });
});

/*
io.on("connection", (socket) => {
  socket.on("new-user", (data) => {
    users[socket.id] = { roomId: data.roomId, name: data.name };
    console.log(`new user has connected, incoming data: ${data.roomId}`);
  });

  socket.on("message", (data) => {
    console.log(
      `${data.message} From user: ${socket.id} in room: ${
        users[socket.id].roomId
      }`
    );
    io.sockets.emit(`chat-message-${users[socket.id].roomId}`, {
      message: data.message,
      name: users[socket.id].name,
    });
  });

  socket.on(`start-video-play`, (data) => {
    io.sockets.emit(`start-video-play-${users[socket.id].roomId}`, {
      video: data.video,
    });
  });

  socket.on("validate-ownership", async (data) => {
    let room = await rooms.findOne({ id: users[socket.id].roomId });

    if(room.ownerToken == data.token){
        
    }
  });
}); */
