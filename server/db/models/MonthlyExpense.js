const Sequelize = require('sequelize');
const db = require('../db');

const MonthlyExpense = db.define('monthlyExpense', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rule: {
    type: Sequelize.ENUM('FIXED', 'PERCENT'),
    allowNull: false,
    defaultValue: 'FIXED',
  },
  percent: {
    type: Sequelize.FLOAT,
  },
  amount: {
    type: Sequelize.INTEGER,
  },
});

MonthlyExpense.beforeSave(async (monthlyExpense) => {
  if (monthlyExpense.rule === 'FIXED') {
    monthlyExpense.percent = null;
  } else {
    monthlyExpense.amount = null;
  }
});

module.exports = MonthlyExpense;
