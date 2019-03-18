'use strict';
module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    tutor: DataTypes.STRING,
    message: DataTypes.STRING,
    linkedQuestion: DataTypes.STRING,
    expiration: DataTypes.DATE,
    rejected: DataTypes.BOOLEAN
  }, {});
  Offer.associate = function(models) {
    // associations can be defined here
  };
  return Offer;
};