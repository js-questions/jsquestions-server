const db = require('./database/models');
const { verifyToken } = require('./middleware/auth.verification');

const Router = require('koa-router');
const router = new Router();

const authCtrl = require('./controllers/authentication');
const usersCtrl = require('./controllers/users');
const questionsCtrl = require('./controllers/questions');
const offersCtrl = require('./controllers/offers');

router.post('/sign-up', (ctx, next) => authCtrl.signUp(ctx, db, next), (ctx) => authCtrl.logIn(ctx, db));
router.get('/log-in', (ctx) => authCtrl.logIn(ctx, db));

// router.use(verifyToken);
router.get('/users', verifyToken, (ctx) => usersCtrl.getAllUsers(ctx, db));
router.get('/users/:userId', verifyToken, (ctx) => usersCtrl.getOneUser(ctx, db));
router.put('/me', verifyToken, (ctx) => usersCtrl.updateProfile(ctx, db))

router.get('/questions', verifyToken, (ctx) => questionsCtrl.getAllQuestions(ctx, db));
router.post('/questions', verifyToken, (ctx) => questionsCtrl.postOneQuestion(ctx, db));
router.get('/questions/asked', verifyToken, (ctx) => questionsCtrl.getAllAskedQuestions(ctx, db));
router.put('/questions/:questionid', verifyToken, (ctx) => questionsCtrl.updateQuestionStatus(ctx, db));
router.put('/questions/:questionid/feedback', verifyToken, (ctx) => questionsCtrl.closeQuestion(ctx, db));

router.post('/questions/:questionid/offers', verifyToken, (ctx) => offersCtrl.createOffer(ctx, db));
router.get('/questions/:questionid/offers', verifyToken, (ctx) => offersCtrl.getQuestionOffers(ctx, db));
router.put('/offers/:offerid/reject', verifyToken, (ctx) => offersCtrl.rejectOffer(ctx, db));

module.exports = router;
