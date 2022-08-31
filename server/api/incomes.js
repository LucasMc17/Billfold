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
    const newIncome = await Income.create({
      amount: req.body,
      userId: req.user.id,
      startDate: today - 1,
      startMonth: today.getMonth() + 1,
      startYear: today.getFullYear(),
    });
    await oldIncome.update({
      endYear: today.getFullYear(),
      endMonth: today.getMonth() + 1,
    });
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
