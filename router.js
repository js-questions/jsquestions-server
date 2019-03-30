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

// Protected routes
router.use(verifyToken);

router.get('/users', (ctx) => usersCtrl.getAllUsers(ctx, db));
router.get('/users/:userId', (ctx) => usersCtrl.getOneUser(ctx, db));
router.put('/me', (ctx) => usersCtrl.updateProfile(ctx, db));

router.post('/questions', (ctx) => questionsCtrl.postOneQuestion(ctx, db));
router.get('/questions', (ctx) => questionsCtrl.getAllQuestions(ctx, db));
router.get('/questions/asked', (ctx) => questionsCtrl.getAllAskedQuestions(ctx, db));
router.put('/questions/:questionid', (ctx) => questionsCtrl.updateQuestionStatus(ctx, db));
router.put('/questions/:questionid/feedback', (ctx) => questionsCtrl.closeQuestion(ctx, db));

router.post('/questions/:questionid/offers', (ctx) => offersCtrl.createOffer(ctx, db));
router.get('/questions/:questionid/offers', (ctx) => offersCtrl.getQuestionOffers(ctx, db));
router.put('/offers/:offerid/reject', (ctx) => offersCtrl.rejectOffer(ctx, db));

module.exports = router;
