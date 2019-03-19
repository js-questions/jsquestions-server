require('dotenv').config({ path: '.env' })

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

const app = new Koa();
const db = require('./database/models')

app.use(bodyParser());
app.use(cors());

(async () => {
  await db.sequelize.drop();  // Testing DB
  await db.sequelize.sync({ force: true });  // Testing DB
  app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
    await db.User.create({  // Testing DB
      username: 'Suelings',
      email: 'test',
      password: 'cha'
    });

    await db.User.create({  // Testing DB
      username: 'test',
      email: 'test2',
      password: 'cha'
    });

    await db.Question.create({  // Testing DB
      learner: 1,
      title: 'test',
      description: 'test',
    })

    await db.Offer.create({  // Testing DB
      tutor: 2,
      linkedQuestion: 1,
    })

    await db.Question.update({  // Testing DB
      answeredBy: 1
    }, {
      where: { questionId: 1 }
    })
  });
})()

console.log(typeof process.env.SALT);
