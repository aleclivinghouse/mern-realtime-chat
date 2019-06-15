const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
var RoomSchema = new Schema({
    admin:{
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    title: { type: String, required: true },
    connections: { type: [{ userId: String, socketId: String }]},
    users: [{ type: Schema.ObjectId, ref: 'user' }]
});

module.exports = Room = mongoose.model('rooms', RoomSchema);
//we just have to post when a user joins a room like when a user messages
