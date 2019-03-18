'use strict';

module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    offerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tutor: DataTypes.INTEGER,
    message: DataTypes.STRING,
    linkedQuestion: DataTypes.INTEGER,
    expiration: DataTypes.DATE,
    rejected: {
      type: DataTypes.BOOLEAN,
      default: false,
    }
  }, {});

  Offer.associate = (models) => {
    Offer.hasOne(models.Question, { as: 'answeredBy', foreignKey: 'offerId' })
  };

  return Offer;
};
