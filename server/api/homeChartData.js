const router = require('express').Router();
const {
  models: { DailyExpense, YearlyDeduction, Income, MonthlyExpense },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

router.get(
  '/custom/:startYear/:startMonth/to/:endYear/:endMonth',
  requireToken,
  async (req, res, next) => {
    try {
      let { startYear, startMonth, endYear, endMonth } = req.params;
      startYear = Number(startYear);
      startMonth = Number(startMonth) - 1;
      if (startMonth === 0) {
        startMonth = 12;
        startYear--;
      }
      console.log(startMonth);
      endYear = Number(endYear);
      endMonth = Number(endMonth);
      const result = { spents: [], budgets: [], labels: [] };
      while (endYear !== startYear || endMonth !== startMonth) {
        result.labels.unshift(`${months[endMonth - 1]}, ${endYear}`);
        result.spents.unshift(
          await DailyExpense.sum('amount', {
            where: {
              userId: req.user.id,
              month: endMonth,
              year: endYear,
            },
          })
        );
        const qDate = new Date(endYear, endMonth - 1, 15);
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
        if (!income) {
          result.budgets.unshift(0);
        } else {
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
        }
        if (endMonth === 1) {
          endMonth = 12;
          endYear--;
        } else {
          endMonth--;
        }
      }
      console.log(result);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:num', requireToken, async (req, res, next) => {
  try {
    const { num } = req.params;
    const today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    const result = { spents: [], budgets: [], labels: [] };
    for (let i = 0; i < Number(num); i++) {
      result.labels.unshift(`${months[month]}, ${year}`);
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
      if (!income) {
        result.budgets.unshift(0);
      } else {
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
      }
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
