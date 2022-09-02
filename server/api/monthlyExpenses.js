const router = require('express').Router();
const {
  models: { MonthlyExpense },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const today = new Date(year, month, 15);
    console.log('EXPENSES: ', today);
    const expenses = await MonthlyExpense.findAll({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: today,
        },
        [Op.or]: [
          {
            endDate: {
              [Op.gt]: today,
            },
          },
          { endDate: null },
        ],
      },
    });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await MonthlyExpense.findByPk(id);
    res.json(expense);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldEx = await MonthlyExpense.findByPk(id);
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    if (oldEx.startMonth === month + 1 && oldEx.startYear === year) {
      await oldEx.destroy();
    } else {
      await oldEx.update({
        endYear: year,
        endMonth: month + 1,
        endDate: new Date(year, month) - 1,
      });
    }
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const ex = await MonthlyExpense.findByPk(id);
    await ex.update(req.body);
    res.json(ex);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const expense = await MonthlyExpense.create({
      ...req.body,
      userId: req.user.id,
      startMonth: month + 1,
      startYear: year,
      startDate: new Date(year, month),
    });
    res.json(expense);
  } catch (err) {
    next(err);
  }
});
