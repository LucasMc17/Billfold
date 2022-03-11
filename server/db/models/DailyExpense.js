const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../db');

const DailyExpense = db.define('dailyExpense', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  month: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 12,
      min: 0,
    },
  },
  year: {
    type: Sequelize.INTEGER,
    defaultValue: new Date().getFullYear(),
    validate: {
      max: new Date().getFullYear(),
      min: 1900,
    },
  },
  day: {
    type: Sequelize.INTEGER,
    defaultValue: new Date().getDate(),
    validate: {
      max: 31,
      min: 1,
    },
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

DailyExpense.beforeValidate(async (dailyExpense) => {
  dailyExpense.month = dailyExpense.date.getMonth() + 1;
  dailyExpense.year = dailyExpense.date.getFullYear();
  dailyExpense.day = dailyExpense.date.getDate();
});

module.exports = DailyExpense;
