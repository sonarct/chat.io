const Mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const MessageSchema = new Mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  room: { type: ObjectId, required: true },
});

const messageModel = Mongoose.model('message', MessageSchema);

module.exports = messageModel;
