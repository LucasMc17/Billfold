const Sequelize = require('sequelize');
const db = require('../db');

const Income = db.define('income', {
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 40000,
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

module.exports = Income;
