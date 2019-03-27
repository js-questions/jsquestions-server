const { decode } = require('jsonwebtoken');

class Socketer {
  constructor (io, db) {
    this.io = io;
    this.db = db;
    this.editor = {
      code: ''
    };
  }

  connection (socket) {
    console.log('A user with socket ' + socket.id + ' has entered.');

    // If the user is loged in, add it to the onlineUsers obj
    socket.on('user online', ({ token }) => {
      if (token) {
        this.db.onlineUsers[decode(token).user_id] = socket.id;
        console.log('Online users:', this.db.onlineUsers);
      }
    });
  
    // Whenever the user leaves the app, we mark her us undefined
    socket.on('disconnect', () => {
      console.log(`The user with socket ${socket.id} has left.`);
      Object.keys(this.db.onlineUsers).map((value) => {
        if (this.db.onlineUsers[value] === socket.id) {
          this.db.onlineUsers[value] = undefined;
        }
      });
    });
  
    // JOIN ROOM
    socket.on('join room', (room) => this.joinRoom(room, socket))

    // CHAT
    socket.on('chat message', (msg) => this.sendMsg(msg, socket));

    // UPDATE KARMA
    socket.on('update karma', (data) => this.io.sockets.connected[this.db.onlineUsers[data.tutor]].emit('update karma', data));

    // EDITOR
    socket.emit('newUser', this.editor);
    socket.on('editor', (data) => this.handleCodeSend(data, socket));

    // OFFLINE USER
    socket.on('offline user', (user) => db.onlineUsers[user] = undefined);

    // UPDATE THE QUESTION OF THE CHAT
    socket.on('question info', (data) => this.sendQuestionInfo(data));

    // PUSH MESSAGE TO TUTOR
    socket.on('chat now', ({ question, learner }) => this.pushTutor(question, learner, socket))
    
    // HANG UP
    socket.on('hang up', ({ roomId }) => {
      // Sends a message back to the room stating which user hanged up
      this.io.in(roomId).emit('hang up', 'username hang up.');
      // Disconnect all users from the room
      this.io.in(roomId).clients((err, clients) => {
        if (err) {
          console.log(err);
        }
        for (let i = 0; i < clients; i++) {
          this.io.sockets.connected[clients[i]].disconnect(true);
        }
      })
    })

    // CANCEL CALL
    socket.on('cancel call', (tutor) => {
      this.io.sockets.connected[this.db.onlineUsers[tutor]].emit('cancel call');
    })

    // UPDATE OFFERS
    socket.on('offer sent', ({ offer, learner_id }) => this.sentOffer(offer, learner_id, socket))
  }

  joinRoom(room, socket) {
    console.log('User with socket ' + socket.id + ' just joined room ' + room)
    socket.join(room);
    const participants = this.io.sockets.adapter.rooms[room].length;
    this.io.in(room).emit('join room', participants);
  }

  sendQuestionInfo(data) {
    this.db.onlineUsers[data.tutor] && this.io.sockets.connected[this.db.onlineUsers[data.tutor]].emit('question info', data.question);
  }

  sendMsg (msg){
    console.log('Messege data', msg)
    this.io.to(msg.room).emit('chat message', msg);
  }

  handleCodeSend (data) {
    console.log('Code sent', data);
    this.editor.code = data.code;
    this.io.to(data.room).emit('editor', data);
  }

  pushTutor (question, learner) {
    // Emiting to an specific socketId
    this.db.onlineUsers[question.tutor] && this.io.sockets.connected[this.db.onlineUsers[question.tutor]].emit('push tutor', { question, learner });
    // Recieving the tutor in the question data from the FE
    // Maybe it will be better to query the database to check who is
    // the tutor of the offer in answered_by
  }

  sentOffer (offer, learner_id) {
    this.db.onlineUsers[learner_id] && this.io.sockets.connected[this.db.onlineUsers[learner_id]].emit('offer sent', offer);
  }

}

module.exports = Socketer
