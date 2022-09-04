const router = require('express').Router();
const {
  models: { DailyExpense, YearlyDeduction, Income, MonthlyExpense },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.get('/:num', requireToken, async (req, res, next) => {
  try {
    const { num } = req.params;
    const today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    const result = { spents: [], budgets: [] };
    for (let i = 0; i < Number(num); i++) {
      result.spents.unshift(
        await DailyExpense.sum('amount', {
          where: {
            userId: req.user.id,
            month: month + 1,
            year: year,
          },
        })
      );
      const qDate = new Date(year, month, 15);
      const income = await Income.findOne({
        where: {
          userId: req.user.id,
          startDate: {
            [Op.lt]: qDate,
          },
          [Op.or]: [
            { endDate: null },
            {
              endDate: {
                [Op.gt]: qDate,
              },
            },
          ],
        },
      });
      const deducts = await YearlyDeduction.findAll({
        where: {
          userId: req.user.id,
          startDate: {
            [Op.lt]: qDate,
          },
          [Op.or]: [
            { endDate: null },
            {
              endDate: {
                [Op.gt]: qDate,
              },
            },
          ],
        },
      });
      const expenses = await MonthlyExpense.findAll({
        where: {
          userId: req.user.id,
          startDate: {
            [Op.lt]: qDate,
          },
          [Op.or]: [
            { endDate: null },
            {
              endDate: {
                [Op.gt]: qDate,
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
      result.budgets.unshift(budget);
      if (month === 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});
