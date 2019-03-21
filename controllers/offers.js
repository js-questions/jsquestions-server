const jwt = require('jsonwebtoken');

exports.createOffer = async (ctx, db) => {

  try {

    const { message, expiration } = ctx.request.body;
    const bearer = ctx.headers.authorization.split(' ');
    const prettyBearer = (jwt.decode(bearer[1]));

    ctx.body = await db.Offer.create({
      tutor: prettyBearer.user_id,
      linked_question: ctx.params.questionid,
      message,
      expiration
    })

    ctx.status = 200;

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.rejectOffer = async (ctx, db) => {

  try {

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.getQuestionOffers = async (ctx, db) => {

  try {

    const question = await db.Question.findOne({
      where: {
        question_id: ctx.params.questionid
      }
    })

    const offers = await db.Offer.findAll({
      where: {
        linked_question: ctx.params.questionid
      }
    })
    ctx.body = { question: question, offers: offers };
    ctx.status = 200;

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
