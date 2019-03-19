const db = require('./../database/models');
const { Sequelize } = require('./../database/models');
const btoa = require('btoa');
const atob = require('atob');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.signUp = async (ctx, next) => {
  const { username, email, password } = ctx.request.body;
  const existingUser = await db.User.findOne({
    where: {
      // Sequelize OR operator, checks for existing email OR username
      [Sequelize.Op.or]: [{email}, {username}]
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

exports.logIn = async (ctx) => {
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

    // Generate the token and send it to the FE
    const jwtSignAsync = promisify(jwt.sign);
    ctx.body = {
      token: await jwtSignAsync({ user }, process.env.JWTSECRET)
    };
    ctx.status = 200;
  }
}
