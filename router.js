const Router = require('koa-router');
const authCtrl = require('./controllers/authentication');
const db = require('./database/models');

const router = new Router();

router.post('/sign-up', (ctx, next) => authCtrl.signUp(ctx, db, next), (ctx) => authCtrl.logIn(ctx, db));
router.get('/log-in', (ctx) => authCtrl.logIn(ctx, db));

module.exports = router;
