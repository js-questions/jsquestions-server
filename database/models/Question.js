'use strict';

module.exports = (sequelize, DataTypes) => {
  const tableName = 'questions';
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
      defaultValue: false,
    },
    roomId: DataTypes.UUID,
  }, { tableName });
  Question.associate = (models) => {
    Question.belongsTo(models.User, { foreignKey: 'learner', targetKey: 'userId' });
    Question.hasMany(models.Offer, { foreignKey: 'linkedQuestion', targetKey: 'questionId' });
  };
  return Question;
};
