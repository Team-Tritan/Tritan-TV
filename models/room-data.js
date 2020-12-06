const mongoose = require('mongoose');

const roomData = mongoose.Schema({
    queue: Array,
    name: String,
    id: String,
    public: Boolean
});

module.exports = mongoose.model('Room Data', roomData, 'Room Data' );