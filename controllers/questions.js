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
      room_id: uuid.v4()  // move the room assigment to a hook in the model
    })
    // introduce a check to see if the user has available tokens
    ctx.status = 200;

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.getAllQuestions = async (ctx, db) => {

  try {

    const bearer = ctx.headers.authorization.split(' ');
    const prettyBearer = (jwt.decode(bearer[1]));
    const allQuestions = await db.Question.findAll({
      attributes: [
        'question_id',
        'answered_by',
        'learner',
        'title',
        'description',
        'resources',
        'code',
        'answered',
        'room_id',
        'createdAt',
        'updatedAt'
      ]
    })

    const pending = await db.sequelize.query('SELECT questions.question_id,' +
    'questions.answered_by, ' +
    'questions.answered, '+
    'offers.rejected ' +
    'FROM questions JOIN offers '+
    'ON questions.question_id = offers.linked_question' +
    ' WHERE offers.tutor=:target1 and offers.rejected = false',
    {
      replacements: {
        target1: prettyBearer.user_id
      }, type: db.sequelize.QueryTypes.SELECT
    });

    const pendingQuestions = pending.map((el) => el.question_id)

    const closed = await db.sequelize.query('SELECT questions.question_id,' +
    'questions.answered_by, ' +
    'questions.answered, '+
    'offers.rejected ' +
    'FROM questions JOIN offers '+
    'ON questions.question_id = offers.linked_question '+
    'WHERE offers.tutor=:target1 and (offers.rejected = true or questions.answered=true)',
    {
      replacements: {
        target1: prettyBearer.user_id
      }, type: db.sequelize.QueryTypes.SELECT
    })

    const closedQuestions = closed.map((el) => el.question_id)

    const responseQuestions = allQuestions.filter((question) => {
      if (pendingQuestions.includes(question.question_id)) {
        question.dataValues['status'] = 'pending'
      }
      if (closedQuestions.includes(question.question_id)) {
        question.dataValues['status'] = 'closed'
      }
      if (!question.dataValues['status']) question.dataValues['status'] = 'help-now'

      if (question.learner !== prettyBearer.user_id && (question.answered === false || question.dataValues['status'] === 'closed')) {
        return question;
      }
    })

    ctx.body = responseQuestions
    ctx.status = 200

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.getAllAskedQuestions = async (ctx, db) => {

  try {
    const bearer = ctx.headers.authorization.split(' ');
    const prettyBearer = (jwt.decode(bearer[1]));
    const allQuestions = await db.Question.findAll({
      attributes: [
        'question_id',
        'answered_by',
        'learner',
        'title',
        'description',
        'resources',
        'code',
        'answered',
        'room_id',
        'createdAt',
        'updatedAt'
      ],
      where: {
        learner: prettyBearer.user_id
      }
    })
    ctx.body = allQuestions;
    ctx.status = 200;
  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.updateQuestionStatus = async (ctx, db) => {
  try {
    const { answered_by } = ctx.request.body;
    const question = await db.Question.findOne({
      where: { question_id: ctx.params.questionid }
    });
    const bearer = ctx.headers.authorization.split(' ');
    const prettyBearer = (jwt.decode(bearer[1]));
    // Check if the user requesting the change is the learner
    if (question.learner === prettyBearer.user_id) {
      await db.Question.update(
        { answered_by },
        {
          returning: true,  // So it returns the updatedQuestion as well
          where: { question_id: question.question_id }
        }
      ).then(([ rowsUpdate, [ updatedQuestion ] ]) => {
        ctx.body = updatedQuestion;
        ctx.status = 200;
      })
    } else {
      ctx.body = JSON.stringify('You\'re not authorized to make this change');
      ctx.status = 403;
    }
  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.closeQuestion = async (ctx, db) => {

  try {

    const { karma, credits: tokens } = ctx.request.body;
    const target = ctx.params.questionid;
    const participants = await db.sequelize.query('SELECT users.user_id, users.credits, offers.offer_id, offers.tutor, questions.question_id, questions.learner, questions.answered_by FROM questions JOIN offers ON questions.question_id = offers.linked_question JOIN users ON questions.learner = users.user_id WHERE questions.question_id = :target AND offers.offer_id = questions.answered_by',
    {
      replacements: { target: target }, type: db.sequelize.QueryTypes.SELECT
    })
    
    if (participants.length === 1) {
      await db.User.decrement({
        credits: participants[0].credits - tokens >= 0 ? tokens : participants[0].credits
      },
      {
        where: {
          user_id: participants[0].learner
        }
      })
      await db.User.increment({
        karma: karma,
        credits: tokens
      },
      {
        where: {
          user_id: participants[0].tutor
        }
      })
      const response = await db.Question.update({
        answered: true
      },
      {
        returning: true,
        where: {
          question_id: participants[0].question_id
        }
      })
      ctx.body = response[1][0];
      ctx.status = 200


    } else {
      ctx.body = {error: 'Question not found'}
      ctx.status = 401;
    }

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
