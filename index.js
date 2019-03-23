require('dotenv').config({ path: '.env' })
const db = require('./database/models');
db.onlineUsers = {};

const Koa = require('koa')
const app = new Koa()
const server = require('http').Server(app.callback())

const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const router = require('./router');

const io = require('socket.io')(server, {
  pingInterval: 900000,
  pingTimeout: 5000,
})
const Socketer = require('./socket');
const ioClient = new Socketer(io, db);
io.on('connection', (socket) => ioClient.connection(socket))

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
