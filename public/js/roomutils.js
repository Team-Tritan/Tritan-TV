function checkOwnership() {
  var ownershipToken = localStorage.getItem(`ownershipToken_${room.id}`);

  socket.emit("validate-ownership", { token: ownershipToken });
}
