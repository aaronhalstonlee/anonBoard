const mongoose = require('mongoose');
const Threads = require('../controllers/models.js').Threads;

function threadHandler(){
  this.listThreads = (req, res) => {
    const board = req.params.board;
    const Thread = Threads(board)//mongoose.model(board, Threads);
    //console.log(req.query);
    Thread.find({}, {reported: 0, delete_password: 0}, {replies: {$slice: 3}})
      //.sort({bumped_on: -1})
      .limit(10)
      .exec((err, threads)=>{
        if(err&&err.reason != undefined) throw(err);
        if(!threads) res.send('no threads found');
        //console.log('threads is an ' + typeof threads);
        //console.log(board)
        res.json(threads)
      }
    );
  };
  
  this.newThread = (req, res) => {
    const board = req.params.board;
    const password = req.body.delete_password;
    const Thread = Threads(board);
    const newThread = new Thread({
      text: req.body.text,
      delete_password: req.body.delete_password,
      reported: false,
    });
    if(password){
      newThread.save((err, saved) => {
        if(err) throw(err);
        if(board == 'test'){
          //console.log(saved)
          res.send(saved);
        } else {
          res.redirect('/b/'+board+'/');
        }
      })
    } else {
      res.send('error');
    }
  }
  
  this.reportThread = (req, res) => {
    const board = req.params.board;
    const thread_id = board !== 'test' ? req.body.report_id : req.body.id;
    const Thread = Threads(board);
    //console.log(req.body, thread_id);
    
    Thread.findById(thread_id, (err,thread) => {
      //console.log(thread_id);
      if(err&&err.reason != undefined) throw(err)
      //console.log(thread)
      if(!thread) res.send('no thread found to report');
      thread.reported = true;
      thread.save((err, saved) => {
        res.send('success');
      })
    });
  }
  
  this.deleteThread = async (req, res, next) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    //const reply_id = req.body.reply_id;
    const delete_password = req.body.delete_password;
    var auth;
    const Thread = Threads(board);
    
       
    try {
      const thread = await Thread.findOne(
        {_id: thread_id }
      )
      if (!thread) {
        return res.send('thread_id not found');
      }
      //const reply = thread.replies.filter(r => r._id == reply_id)[0]
      if (thread.delete_password !== delete_password) {
        return res.send('incorrect password')
      }
      await Thread.updateOne(
        {_id: thread_id },
        {$set: {
          text: '[deleted]'
          }
        }
      )
      res.send('success');
    } catch (err) {
      console.error(err);
      next()
    }
  } 
    /*(req, res) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    const password = req.body.delete_password;
    const Thread = Threads(board);
    
    Thread.findOne({_id: thread_id, delete_password: password}, (err, thread) => {
      if(err&&err.reason != undefined) throw(err);
      if(!thread) res.send('incorrect password');
      if(thread.delete_password == password){
        thread.remove();
        res.json('success');
      }
    });
  }*/
}


module.exports = threadHandler;