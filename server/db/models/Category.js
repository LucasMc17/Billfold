const Sequelize = require('sequelize');
const db = require('../db');

const Category = db.define('category', {
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

Category.beforeSave(async (category) => {
  if (category.rule === 'FIXED') {
    category.percent = null;
  } else {
    category.amount = null;
  }
});

module.exports = Category;
