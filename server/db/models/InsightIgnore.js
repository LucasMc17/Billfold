const Sequelize = require('sequelize');
const db = require('../db');

const InsightIgnore = db.define('insight-ignore', {
  catName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  suggestion: {
    type: Sequelize.ENUM('OVERSPENT', 'UNDERSPENT'),
    allowNull: false,
  },
  ignoredDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = InsightIgnore;
