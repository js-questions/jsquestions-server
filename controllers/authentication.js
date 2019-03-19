const db = require('./../database/models');
const { Sequelize } = require('./../database/models');

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

  await next();
}