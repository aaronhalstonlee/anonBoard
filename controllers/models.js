const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Threads = new Schema({
  text: String,
  created_on: {
    type: Date,
    default: Date.now()
  },
  bumped_on: {
    type: Date,
    default: Date.now()
  },
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: String,
  replies: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    text: String,
    created_on: {
      type: Date,
      default: Date.now()
    },
    reported: {
      type: Boolean,
      default: false
    },
    delete_password: String
  }]
});
/*
const Replies = new Schema({
  text: String,
  created_on: {
    type: Date,
    default: Date.now()
  },
  reported: Boolean,
  delete_password: String,
});
*/
module.exports.Threads = function setModel(board){ return mongoose.model(board, Threads) };
//module.exports.Replies = function setModel(board){ return mongoose.model(board, Replies) };