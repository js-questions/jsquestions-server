const Router = require('koa-router');
const authCtrl = require('./controllers/authentication');
const usersCtrl = require('./controllers/users');
const db = require('./database/models');
const { verifyToken } = require('./middleware/auth.verification');

const router = new Router();

router.post('/sign-up', (ctx, next) => authCtrl.signUp(ctx, db, next), (ctx) => authCtrl.logIn(ctx, db));
router.get('/log-in', (ctx) => authCtrl.logIn(ctx, db));

router.get('/users', verifyToken, (ctx) => usersCtrl.getAllUsers(ctx, db));
router.get('/users/:userId', verifyToken, (ctx) => usersCtrl.getOneUser(ctx, db));

module.exports = router;
