const router = require('express').Router();
const {
  models: { User, Income },
} = require('../db');
module.exports = router;

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.income) {
      res.status(401).send('Please fill out all fields!');
    } else {
      const today = new Date();
      const startMonth = today.getMonth() + 1;
      const startYear = today.getFullYear();
      const user = await User.create(req.body);
      const income = await Income.create({
        amount: req.body.income,
        startDate: new Date(startYear, startMonth - 1),
        startMonth,
        startYear,
      });
      await income.setUser(user);
      res.send({ token: await user.generateToken() });
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});
