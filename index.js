require('dotenv').config({ path: '.env' })

const Koa = require('koa')
const app = new Koa()
const server = require('http').Server(app.callback())

const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const db = require('./database/models')
db.onlineUsers = {};
const router = require('./router');

const io = require('socket.io')(server);
const { decode } = require('jsonwebtoken');

io.on('connection', connection);

const editor = {
  text: ''
};

function connection (socket) {
  console.log('A user with socket ' + socket.id + ' has entered.');

  // If the user is loged in, add it to the onlineUsers obj
  socket.on('user online', ({ token }) => {
    if (token) {
      db.onlineUsers[decode(token).user_id] = socket.id;
      console.log('Online users:', db.onlineUsers);
      console.log('Ping specific user:', db.onlineUsers['1']);
    }
  });

  // Whenever the user leaves the app, we mark her us undefined
  socket.on('disconnect', () => {
    console.log(`The user with socket ${socket.id} has left.`);
    Object.keys(db.onlineUsers).map((value) => {
      if (db.onlineUsers[value] === socket.id) {
        db.onlineUsers[value] = undefined;
      }
    });
  });

  socket.on('join room', joinRoom)
  
  // CHAT
  socket.on('chat message', sendMsg);
  function sendMsg (msg){
    console.log('Messege data', msg)
    io.to(msg.room).emit('chat message', msg);
  }
  
  // EDITOR
  socket.emit('newUser', editor);
  socket.on('editor', handleTextSend);
  function handleTextSend (data) {
    console.log('handle text send', data);
    editor.text = data.text;
    io.to(data.room).emit('editor', data);
  }

  function joinRoom(room) {
    console.log('Connected to room', room)
    socket.join(room);
  }

  // PUSH MESSAGE TO TUTOR
  socket.on('chat now', (question) => {
    pushTutor(question)
  })

  function pushTutor (question) {
    // Emiting to an specific socketId
    io.sockets.connected[db.onlineUsers[question.answered_by]].emit('push tutor', question);
  }
}

app.use(bodyParser())
app.use(cors());
app.use(router.routes());

(async () => {
  // await db.sequelize.drop();                 // drop db and
  // await db.sequelize.sync({ force: true });  // restart it
  await db.sequelize.sync();
  server.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
})()
