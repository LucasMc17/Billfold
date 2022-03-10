//this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const YearlyDeduction = require('./models/YearlyDeduction');

//associations could go here!
User.hasMany(YearlyDeduction);
YearlyDeduction.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    YearlyDeduction,
  },
};
