const Sequelize = require('sequelize');
const db = require('../db');

const YearlyDeduction = db.define('yearlyDeduction', {
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

YearlyDeduction.beforeSave(async (yearlyDeduction) => {
  if (yearlyDeduction.rule === 'FIXED') {
    yearlyDeduction.percent = null;
  } else {
    yearlyDeduction.amount = null;
  }
});

module.exports = YearlyDeduction;
