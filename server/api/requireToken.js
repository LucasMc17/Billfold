const {
  models: { User },
} = require('../db');

const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const user = await User.findByToken(token);
    req.user = user.dataValues;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireToken };
