require('dotenv').config({ path: '.env' })

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

const app = new Koa();
const db = require('./database/models')

app.use(bodyParser());
app.use(cors());

(async () => {
  // await db.sequelize.drop();  // Testing DB
  // await db.sequelize.sync({ force: true });  // Testing DB
  await db.sequelize.sync();
  app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
})()

console.log(typeof process.env.SALT);
