'use strict';

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    questionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    answeredBy: DataTypes.INTEGER,
    learner: DataTypes.INTEGER,
    title:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resources: DataTypes.STRING,
    code: DataTypes.STRING,
    answered: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    roomId: DataTypes.UUID,
  }, {});
  Question.associate = (models) => {
    Question.belongsTo(models.User, { as: 'learner', foreignKey: 'userId' });
    Question.hasMany(models.Offer, { as: 'linkedQuestion', foreignKey: 'questionId' });
  };
  return Question;
};
