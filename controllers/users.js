exports.getAllUsers = async (ctx, db) => {
  try {
    ctx.body = await db.User.findAll({
      attributes: [
        'userId',
        'username',
        'email',
        'firstName',
        'lastName',
        'credits',
        'karma',
        'available',
        'profileBadge',
        'createdAt',
        'updatedAt',
      ]
    });
    ctx.status = 200;
  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
