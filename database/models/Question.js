'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    answerBy: DataTypes.STRING,
    learner: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    resources: DataTypes.STRING,
    code: DataTypes.STRING,
    answered: DataTypes.BOOLEAN,
    roomId: DataTypes.UUID
  }, {});
  Question.associate = function(models) {
    // associations can be defined here
  };
  return Question;
};