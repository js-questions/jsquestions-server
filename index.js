require('dotenv').config({ path: '.env' })

const Koa = require('koa')
const app = new Koa()
const http = require('http').Server(app)

const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const db = require('./database/models')
const router = require('./router');

const io = require('socket.io')(http);

io.on('connection', connection);

const text = {
  text: ''
};

function connection (socket) {
  console.log('A new user with id ' + socket.id + ' has entered');
  socket.emit('newUser', text);
  socket.on('text', handleTextSend);

  socket.on('join room', joinRoom)

  // CHAT
  socket.on('chat message', sendMsg);
  function sendMsg (msg){
    console.log(msg)
    console.log(msg.room)
    io.to(msg.room).emit('chat message', msg);
  }

  // EDITOR
  function handleTextSend (data) {
    console.log('handle text send', data);
    text.text = data.text;
    io.to('1234').emit('text', data); // It´s sending it to all the sockets, not only the ones in the room
  }

  function joinRoom(room) {
    console.log('conected!', room)
    socket.join(room);
  }
}

app.use(bodyParser())
app.use(cors());
app.use(router.routes());

(async () => {
  // await db.sequelize.drop();                 // drop db and
  // await db.sequelize.sync({ force: true });  // restart it
  await db.sequelize.sync();
  http.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
})()
