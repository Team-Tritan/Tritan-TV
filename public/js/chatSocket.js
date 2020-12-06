const socket = io('http://localhost:6000');

socket.emit('new-user', { roomId: roomData.id, name: "test"});
