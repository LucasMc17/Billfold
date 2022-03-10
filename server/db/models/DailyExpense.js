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
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

module.exports = DailyExpense;
