const router = require('express').Router();
const {
  models: { Income },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

//this needs testing, may not work yet
router.post('/new-income', requireToken, async (req, res, next) => {
  try {
    const oldIncome = await Income.findOne({
      where: {
        userId: req.user.id,
        endDate: null,
      },
    });
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    if (oldIncome.startMonth === month + 1 && oldIncome.startYear === year) {
      await oldIncome.update({ amount: req.body.income });
      res.json(oldIncome);
    } else {
      const newIncome = await Income.create({
        amount: req.body.income,
        userId: req.user.id,
        startDate: new Date(year, month),
        startMonth: month + 1,
        startYear: year,
      });
      await oldIncome.update({
        endYear: year,
        endMonth: month + 1,
        endDate: new Date(year, month) - 1,
      });
      res.json(newIncome);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const date = new Date(year, month, 15);
    const result = await Income.findAll({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: date,
        },
      },
      order: [['startDate', 'DESC']],
      limit: 1,
    });
    res.json(result[0].amount);
  } catch (err) {
    next(err);
  }
});
