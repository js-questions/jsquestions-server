'use strict';

module.exports = (sequelize, DataTypes) => {
  const tableName = 'offers';
  const Offer = sequelize.define('Offer', {
    offer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tutor: DataTypes.INTEGER,
    message: DataTypes.STRING,
    linked_question: DataTypes.INTEGER,
    expiration: DataTypes.DATE,
    rejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, { tableName });

  Offer.associate = (models) => {
    Offer.hasOne(models.Question, { constraints: false, foreignKey: 'answered_by', targetKey: 'offer_id' })
  };

  return Offer;
};
