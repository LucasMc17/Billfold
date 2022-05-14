const Sequelize = require('sequelize');
const db = require('../db');

const Budget = db.define('budget', {
  yearlies: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
  monthlies: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
  categories: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
  income: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 40000,
  },
  month: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
});

module.exports = Budget;
