'use strict';

const ReplyHandler = require('../controllers/replyHandler.js');
const ThreadHandler = require('../controllers/threadHandler.js');
const mongoose = require('mongoose');
const url = process.env.DB;

mongoose.connect(url,{useNewUrlParser:true},(err,db)=>{
  if(err) throw(err);
  console.log('connected to: ' + db.db.databaseName);
});

module.exports = function (app) {
  const replyHandler = new ReplyHandler();
  const threadHandler = new ThreadHandler();
  
  app.route('/api/threads/:board')
    .get(threadHandler.listThreads)
    .post(threadHandler.newThread)
    .put(threadHandler.reportThread)
    .delete(threadHandler.deleteThread)
    
  app.route('/api/replies/:board')
    .get(replyHandler.getReplies)
    .post(replyHandler.newReply)
    .put(replyHandler.reportReply)
    .delete(replyHandler.deleteReply)
};