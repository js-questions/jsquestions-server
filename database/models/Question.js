'use strict';

module.exports = (sequelize, DataTypes) => {
  const tableName = 'questions';
  const Question = sequelize.define('Question', {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    answered_by: DataTypes.INTEGER,
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
    room_id: DataTypes.UUID,
  }, { tableName });
  Question.associate = (models) => {
    Question.belongsTo(models.User, { foreignKey: 'learner', targetKey: 'user_id' });
    Question.hasMany(models.Offer, { foreignKey: 'linked_question', targetKey: 'question_id' });
  };
  return Question;
};
