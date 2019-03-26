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

    const target = ctx.params.offerid
    await db.sequelize.query('SELECT offers.offer_id, offers.message, offers.tutor, questions.question_id, questions.learner, offers.rejected FROM questions, offers WHERE offers.offer_id = :target and offers.linked_question = questions.question_id', 
    { 
      replacements: { target: target }, type: db.sequelize.QueryTypes.SELECT 
    })
    .then(async result => {
      if (result.length === 1) {
        const bearer = ctx.headers.authorization.split(' ');
        const prettyBearer = (jwt.decode(bearer[1]));
        const offer = result[0];

        if (prettyBearer.user_id === offer.learner) {
          await db.Offer.update(
            {
              rejected: true
            },
            {
              returning: true,
              where: {
                offer_id: target
              }
            }
          ).then(function([ rowsUpdate, [ updatedOffer ] ]) {
            ctx.body = updatedOffer;
            ctx.status = 200
          })
        } else {
          ctx.body = {error: 'Not your question!'}
          ctx.status = 401
        }
      } else {
        ctx.body = {error: 'Offer not found.'}
        ctx.status = 404
      }
    })
    

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
        linked_question: ctx.params.questionid,
        rejected: false
      }
    })

    ctx.body = { question: question, offers: offers };
    ctx.status = 200;

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
