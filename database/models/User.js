'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const hooks = {
    async beforeCreate (user) {
      user.password = await bcrypt.hash(user.password, +process.env.SALT);
    },
  };
  const tableName = 'users';
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    karma: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    available: DataTypes.BOOLEAN,
    profileBadge: DataTypes.STRING
  }, { hooks, tableName });

  User.associate = (models) => {
    User.hasMany(models.Offer, { foreignKey: 'tutor', targetKey: 'userId' });
  };

  return User;
};
