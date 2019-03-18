require('dotenv').config({ path: '.env' })

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

const app = new Koa();
const db = require('./database/models')

app.use(bodyParser());
app.use(cors());

(async () => {
  await db.sequelize.sync();
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
  });
 })()

console.log(typeof process.env.SALT);
db.User.create({
  username: 'Suelings',
  email: 'test',
  password: 'cha'
});

db.Question.create({
  learner: 1,
  title: 'test',
  description: 'test',
});