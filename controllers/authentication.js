const btoa = require('btoa');
const atob = require('atob');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.signUp = async (ctx, db, next) => {
  const { username, email, password } = ctx.request.body;
  const existingUser = await db.User.findOne({
    where: {
      // Sequelize OR operator, checks for existing email OR username
      [db.Sequelize.Op.or]: [{email}, {username}]
    }
  })

  // If the email is already in use...
  if (existingUser) {
    if (existingUser.email === email) {
      ctx.status = 400;
      ctx.body = JSON.stringify(`${email} is already in use.`);
      return;
    } else if (existingUser.username === username) {
      ctx.status = 400;
      ctx.body = JSON.stringify(`${username} is already in use.`);
      return;
    }
  }

  if (!password) {
    ctx.status = 400;
    throw new Error('Password missing');
  }

  await db.User.create({
    username,
    email,
    password
  })

  // Set headers for log-in controller
  const base64 = btoa(`${email}:${password}`);
  ctx.headers.authorization = `Basic ${base64}`;

  await next();
}

exports.logIn = async (ctx, db) => {
  if (ctx.headers.authorization) {
    // Decode the Basic auth
    const basic = ctx.headers.authorization.split(' ');
    if (basic.length < 2 && basic[0] !== 'Basic') {
      throw new Error('Missing basic authentication header.');
    }
    const [email, password] = atob(basic[1]).split(':');

    // Check the user exists
    const user = await db.User.findOne({ where: {email} });
    if (!user) {
      ctx.body = JSON.stringify('Invalid email or password');
      return;
    }

    // Check the password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      ctx.body = JSON.stringify('Invalid email or password');
      return;
    }
    
    // Deconstructing the data for the token
    const {
      userId,
      username,
      firstName,
      lastName,
      credits,
      karma,
      available,
      profileBadge,
      createdAt,
      updatedAt,
    } = user;

    // Generate the token and send it to the FE
    const jwtSignAsync = promisify(jwt.sign);
    ctx.body = {
      token: await jwtSignAsync({
        userId,
        username,
        firstName,
        lastName,
        email,
        credits,
        karma,
        available,
        profileBadge,
        createdAt,
        updatedAt,
      }, process.env.JWTSECRET, { expiresIn: '30 days' })
      // JWT expiration date is in seconds, not miliseconds, so to
      // take it to "JS standards" we need to add 000 at the end
    };
    ctx.status = 200;
  }
}
