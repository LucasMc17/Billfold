//this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const YearlyDeduction = require('./models/YearlyDeduction');
const MonthlyExpense = require('./models/MonthlyExpense');
const Category = require('./models/Category')
const DailyExpense = require('./models/DailyExpense')

//associations could go here!
User.hasMany(YearlyDeduction);
YearlyDeduction.belongsTo(User);

User.hasMany(MonthlyExpense);
MonthlyExpense.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(DailyExpense);
DailyExpense.belongsTo(User);

Category.hasMany(DailyExpense);
DailyExpense.belongsTo(Category);

module.exports = {
  db,
  models: {
    User,
    YearlyDeduction,
    MonthlyExpense,
    Category,
    DailyExpense
  },
};
