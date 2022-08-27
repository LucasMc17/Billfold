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

YearlyDeduction.beforeSave(async (yearlyDeduction) => {
  if (yearlyDeduction.rule === 'FIXED') {
    yearlyDeduction.percent = null;
  } else {
    yearlyDeduction.amount = null;
  }
});

module.exports = YearlyDeduction;
