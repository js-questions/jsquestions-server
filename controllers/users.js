exports.getAllUsers = async (ctx, db) => {
  try {
    const users = await db.User.findAll({
      attributes: [
        'user_id',
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
    for (let user in db.onlineUsers) {
      if (db.onlineUsers[user]) {
        users[user - 1].available = db.onlineUsers[user]
      }
    }
    ctx.body = users;
    ctx.status = 200;
  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.getOneUser = async (ctx, db) => {
  try {
    const user = await db.User.findOne({
      where: { user_id: ctx.params.userId },
      attributes: [
        'user_id',
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
    if (db.onlineUsers[user.user_id]) user.available = db.onlineUsers[user.user_id];
    ctx.body = user;
    ctx.status = 200;
  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}

exports.updateProfile = async (ctx, db) => {

  try {

  } catch (err) {
    console.log(err); // eslint-disable-line
    ctx.status = 500;
  }
}
