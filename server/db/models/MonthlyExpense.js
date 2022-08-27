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
  startMonth: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  startYear: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endMonth: {
    type: Sequelize.INTEGER,
  },
  endYear: {
    type: Sequelize.INTEGER,
  },
  endDate: {
    type: Sequelize.DATE,
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
