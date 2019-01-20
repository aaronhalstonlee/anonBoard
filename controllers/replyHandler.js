const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
//const Replies = require('../controllers/models.js').Replies;
const Threads = require('../controllers/models.js').Threads;

function replyHandler(){
  this.getReplies = (req, res) => {
    const board = req.params.board;
    const thread_id = req.query.thread_id;
    const Thread = Threads(board);
    
    Thread.find({_id: thread_id}, {reported: 0, delete_password: 0}, (err, thread) => {
      //const Reply = Replies('reply')
      if(err) throw(err);
      //console.log(req.body)
      //console.log(thread)
      res.send(thread[0]);
    });

  }
  this.newReply = (req, res) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    const Thread = Threads(board);
    Thread.findById(thread_id, (err, thread) => {
      //console.log(thread);
      const reply = {
        text: req.body.text,
        created_on: Date.now(),
        reported: false,
        delete_password: req.body.delete_password
      };
      //console.log(req.body);
      thread.replies.push(reply);
      thread.bumped_on = Date.now();
      thread.save((err, saved) => {
        if(err&&err.reason != undefined) throw(err);
        if(board == 'test'){
          //console.log(saved)
          res.json(saved);
        } else {
          res.redirect('/b/'+board+'/'+saved._id+'/');
        }
        //console.log(saved.replies[0])
        
      });
    });
  }
  this.reportReply = (req, res) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    const reply_id = req.body.reply_id;
    
    const Thread = Threads(board);
    
    Thread.findOneAndUpdate(
      {_id: thread_id, 
       "replies._id": reply_id}, 
      { 
        $set: {
          'replies.$.reported': true
        }
      },
      {new: true},
      (err, thread) => {
        if(err&&err.reason != undefined) throw(err);
        if(!thread) res.send('not found');
        if(board == 'test'){
          res.send(thread);
        } else {
          res.send('reported')
        }
    })
  }
  
  this.deleteReply = async (req, res) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    const reply_id = req.body.reply_id;
    const delete_password = req.body.delete_password;
    var auth;
    const Thread = Threads(board);
    
       
    try {
      const thread = await Thread.findOne(
        {_id: thread_id, 'replies._id': reply_id,}
      )
      if (!thread) {
        throw 'thread_id or reply_id not found'
      }
      const reply = thread.replies.filter(r => r._id == reply_id)[0]
      if (reply.delete_password !== delete_password) {
        return res.send('incorrect password')
      }
      await Thread.updateOne(
        {_id: thread_id, 'replies._id': reply_id},
        {'replies.$.text': '[deleted]'}
      )
      res.send('success')
    } catch (err) {
      console.error(err);
    }
  }
}  


module.exports = replyHandler;