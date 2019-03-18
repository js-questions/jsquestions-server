'use strict';

module.exports = (sequelize, DataTypes) => {
  const tableName = 'offers';
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
  }, { tableName });

  Offer.associate = (models) => {
    Offer.hasOne(models.Question, { foreignKey: 'answeredBy', targetKey: 'offerId' })
  };

  return Offer;
};