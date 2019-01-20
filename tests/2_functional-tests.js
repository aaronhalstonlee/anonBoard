/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const Threads = require('../controllers/models.js').Threads;
const Thread = Threads('test');
var id;
var report_id;
var reply_id;
chai.use(chaiHttp);

before(done => {
  //console.log(Thread);
  Thread.find({},(err, thread) => {
    if(err) throw(err)
    //report_id = thread[0]._id;
  })
  done()
})
//console.log('outside before func: ', report_id)

suite('Functional Tests', function() {
   
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      let thread = { 
          text: 'this is a test', 
          delete_password: 'password'
        };
      
      test('post new thread', done => {
      
        chai.request(server)
            .post('/api/threads/test')
            .send({text: thread.text, delete_password: thread.delete_password})
            .end((err, res) => {
              if(err) console.error(err);
              //console.log(res);
              assert.ok(res.status);
              assert.property(res.body, 'text')
              assert.property(res.body, 'created_on')
              assert.property(res.body, 'reported')
              assert.property(res.body, 'delete_password')
              assert.property(res.body, 'replies')
              report_id=res.body._id;
              //console.log(report_id);
              done();
            }
          )
      })
      
      test('post new thread with incomplete body', done => {
        let thread = {
          text: 'incomplete'
        }
        chai.request(server)
            .post('/api/threads/test')
            .send(thread)
            .end((err, res) => {
              if(err) throw(err)
              //console.log(res)
              assert.ok(res.status)
              assert.equal(res.text, 'error')
              done();
            })
      })
      
    })
    
    suite('GET', function() {
      
      test('get new threads', done => {
      
        chai.request(server)
            .get('/api/threads/test')
            .end((err, res) => {
              if(err) console.error(err);
              //console.log(res);
              assert.ok(res.status);
              assert.property(res.body[0], 'text')
              assert.property(res.body[0], 'created_on')
              //assert.property(res.body[0], 'reported')
              //assert.property(res.body[0], 'delete_password')
              assert.property(res.body[0], 'replies')
              id=res.body[0]._id;
              //delete_password=res.body[0].delete_password;
              //console.log(id, delete_password)
              done();
            }
          )
      })
    });
    
    suite('DELETE', function() {
      
        
        let thread = { 
          text: 'this is a test', 
          delete_password: 'password'
        };
      
      /*test('post thread for delete', done => {
      
        chai.request(server)
            .post('/api/threads/test')
            .send({text: thread.text, delete_password: thread.delete_password})
            .end((err, res) => {
              if(err) console.log(err);
              console.log('response: '+res);
              id = res.body._id;
              done();
            })
      })*/
      
      test('delete thread', done => {
        //console.log(id);
        chai.request(server)
            .delete('/api/threads/test')
            .send({_id: id, delete_password: 'password'})
            .end((err, res) => {
              if(err) console.log(err)
              assert.ok(res.status);
              //console.log(res);
              done();
            })
        });
    });
    
    suite('PUT', function() {
      test('report thread', done => {
        //console.log('report id in function: ' + report_id)
        chai.request(server)
            .put('/api/threads/test')
            .send({id: report_id})
            .end((err, res) => {
              if(err) throw(err)
              //console.log(res)
              assert.ok(res.status)
              //assert.equal(res.body.reported, true)
              done();
            }
          )
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    let reply = {
      text: 'hello',
      delete_password: 'delete'
    }
    suite('POST', function() {
      test('post new reply', done => {
        chai.request(server)
            .post('/api/replies/test')
            .send({thread_id: id, text: reply.text, delete_password: reply.delete_password})
            .end((err, res) => {
              if(err) throw(err)
              assert.ok(res.status);
              assert.property(res.body, 'replies')
              assert.property(res.body.replies[0], 'created_on');
              assert.property(res.body.replies[0], 'reported');
              assert.property(res.body.replies[0], '_id');
              done();
            }
          )
      })
    });
    
    suite('GET', function() {
      test('get replies', done => {
        //console.log('id for get replies: ', id);
        chai.request(server)
            .get('/api/replies/test')
            .query({thread_id: id})
            .end((err, res) => {
              if(err) throw(err)
              assert.ok(res.status);
              //console.log('res.body: ', res.body);
              reply_id = res.body.replies[0]._id;
              assert.property(res.body, '_id')
              assert.property(res.body, 'replies');
              assert.property(res.body.replies[0], '_id')
              done()
        });
      });
    });
    
    suite('PUT', function() {
      test('report reply', done => {
        chai.request(server)
            .put('/api/replies/test')
            .send({thread_id: id, reply_id: reply_id})
            .end((err, res) => {
              if(err) throw(err)
              assert.ok(res.status)
              assert.equal(res.body.replies[0].reported, true)
              done();
            }
          )
      })
    });
    
    suite('DELETE', function() {
      test('delete reply', done => {
        chai.request(server)
            .delete('/api/replies/test')
            .send({thread_id: id, reply_id: reply_id, delete_password: reply.delete_password})
            .end((err, res) => {
              assert.ok(res.status)
              assert.equal(res.text, 'success');
              //assert.equal(res.body.replies[0].text, '[deleted]')
              done();
            }
          )
      })
    });
    
  });

});
