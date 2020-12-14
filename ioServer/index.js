const http = require("http");
var server = http.createServer();
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["secretHeader"],
    credentials: true,
  },
});

let connectedUsers = new Map();
let connectedQueue = new Map();
let roomQueue = new Map();

server.listen(80);

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
