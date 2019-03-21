const jwt = require('jsonwebtoken');
const uuid = require('uuid');

exports.postOneQuestion = async (ctx, db) => {
  try {
    const { title, description, resources, code } = ctx.request.body;
    const bearer = ctx.headers.authorization.split(' ');
    const prettyBearer = (jwt.decode(bearer[1]));

    ctx.body = await db.Question.create({
      learner: prettyBearer.user_id,
      title,
      description,
      resources,
      code,
      room_id: uuid.v4()
    })
    ctx.status = 200;

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.getAllQuestions = async (ctx, db) => {

  try {

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.getAllAskedQuestions = async (ctx, db) => {

  try {

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.updateQuestionStatus = async (ctx, db) => {

  try {

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.closeQuestion = async (ctx, db) => {

  try {

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
