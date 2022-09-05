const router = require('express').Router();
const {
  models: { DailyExpense, YearlyDeduction, Income, MonthlyExpense, Category },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const date = new Date(year, month - 1, 15);
    const income = await Income.findOne({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: date,
        },
        [Op.or]: [
          { endDate: null },
          {
            endDate: {
              [Op.gt]: date,
            },
          },
        ],
      },
    });
    const deducts = await YearlyDeduction.findAll({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: date,
        },
        [Op.or]: [
          { endDate: null },
          {
            endDate: {
              [Op.gt]: date,
            },
          },
        ],
      },
    });
    const expenses = await MonthlyExpense.findAll({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: date,
        },
        [Op.or]: [
          { endDate: null },
          {
            endDate: {
              [Op.gt]: date,
            },
          },
        ],
      },
    });
    const cats = await Category.findAll({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: date,
        },
        [Op.or]: [
          { endDate: null },
          {
            endDate: {
              [Op.gt]: date,
            },
          },
        ],
      },
    });
    const perMonth =
      deducts.reduce((a, b) => {
        if (b.rule === 'FIXED') {
          return a - b.amount;
        } else {
          return a * (1 - b.percent);
        }
      }, income.amount) / 12;
    const budget = expenses.reduce((a, b) => {
      if (b.rule === 'FIXED') {
        return a - b.amount;
      } else {
        return a * (1 - b.percent);
      }
    }, perMonth);
    const labels = cats.map((cat) => cat.name);
    const dailies = await DailyExpense.findAll({
      where: {
        userId: req.user.id,
        month: month,
        year,
      },
      include: { model: Category },
    });
    const afterFixed =
      budget -
      cats
        .filter((cat) => cat.rule === 'FIXED')
        .reduce((a, b) => a + b.amount, 0);
    const spents = labels.map((label) => {
      const category = cats.filter((cat) => cat.name === label)[0];
      const purchases = dailies.filter(
        (daily) => daily.category.name === category.name
      );
      const totalSpent = purchases.reduce((a, b) => a + b.amount, 0);
      if (category.rule === 'FIXED') {
        return (totalSpent / category.amount) * 100;
      } else {
        return (totalSpent / (category.percent * afterFixed)) * 100;
      }
    });
    const result = {
      labels: [...labels, 'Total'],
      spents: [
        ...spents,
        (dailies.reduce((a, b) => a + b.amount, 0) / budget) * 100,
      ],
      budgets: Array(cats.length + 1).fill(100),
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
});
