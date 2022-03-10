//this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const YearlyDeduction = require('./models/YearlyDeduction');
const MonthlyExpense = require('./models/MonthlyExpense');
const Category = require('./models/Category')

//associations could go here!
User.hasMany(YearlyDeduction);
YearlyDeduction.belongsTo(User);

User.hasMany(MonthlyExpense);
MonthlyExpense.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    YearlyDeduction,
    MonthlyExpense,
    Category
  },
};
