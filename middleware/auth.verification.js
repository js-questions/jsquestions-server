const jwt = require('jsonwebtoken');

exports.verifyToken = async (ctx, next) => {

  const bearerHeader = ctx.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    if (bearer[0] !== 'Bearer') throw new Error('Missing bearer authentication header.');

    await jwt.verify(bearerToken, process.env.JWTSECRET, async (err, authData) => {

      if (err) {

        if (bearerToken === 'null') {

          ctx.status = 403;
          ctx.body = JSON.stringify('You\'re not signed in');

        } else {

          ctx.status = 403;
          ctx.body = JSON.stringify('Your session expired');

        }
      }

      if (authData) {

        // Passing the token the next middleware
        ctx.token = jwt.decode(bearer[1]);
        await next();

      }

    });

  } else {

    ctx.body = JSON.stringify('No authorization header');
    ctx.status = 400;

  }

};
