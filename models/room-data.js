const mongoose = require("mongoose");

const roomData = mongoose.Schema({
  queue: Array,
  name: String,
  id: String,
  public: Boolean,
  userLimit: Number,
  password: String,
});

module.exports = mongoose.model("Room Data", roomData, "Room Data");
