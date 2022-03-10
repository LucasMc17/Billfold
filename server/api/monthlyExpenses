const router = require('express').Router();
const {
  models: { MonthlyExpense },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const expenses = await MonthlyExpense.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});
