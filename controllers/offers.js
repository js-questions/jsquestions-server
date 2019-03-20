const jwt = require('jsonwebtoken');

exports.createOffer = async (ctx, db) => {

  try {

    const { message, expiration } = ctx.request.body;
    const bearer = ctx.headers.authorization.split(' ');
    const prettyBearer = (jwt.decode(bearer[1]));

    ctx.body = await db.Offer.create({
      tutor: prettyBearer.userId,
      linkedQuestion: ctx.params.questionid,
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

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
