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
    if (!req.body.username || !req.body.password) {
      res.status(401).send('Please fill out both fields!');
    } else {
      const user = await User.create(req.body);
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      const income = await Income.create({
        amount: 50000,
        startDate: new Date(year, month),
        startMonth: month,
        startYear: year,
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
