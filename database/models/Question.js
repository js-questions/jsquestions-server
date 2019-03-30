'use strict';
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {

  const hooks = {
    async beforeCreate (question) {
      question.room_id = uuid.v4();
    }
  };

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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resources: DataTypes.STRING,
    code: DataTypes.STRING,
    answered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    room_id: DataTypes.UUID,
  }, { hooks, tableName });

  Question.associate = (models) => {
    Question.belongsTo(models.User, { foreignKey: 'learner', targetKey: 'user_id' });
    Question.belongsTo(models.Offer, { foreignKey: 'answered_by', constraints: false });
  };

  return Question;

};
