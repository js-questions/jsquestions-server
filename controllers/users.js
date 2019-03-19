exports.getAllUsers = async (ctx, db) => {
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
}
