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
    await oldEx.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldEx = await MonthlyExpense.findByPk(id);
    if (req.body.changeDate) {
      const changeDate = new Date(req.body.changeDate);
      const month = changeDate.getMonth();
      const year = changeDate.getFullYear();
      if (oldEx.startMonth === month + 1 && oldEx.startYear === year) {
        await oldEx.update(req.body);
        res.json(oldEx);
      } else {
        await oldEx.update({
          endMonth: month + 1,
          endYear: year,
          endDate: new Date(year, month) - 1,
        });
        const newDeduct = await MonthlyExpense.create({
          ...req.body,
          id: null,
          startMonth: month + 1,
          startYear: year,
          startDate: new Date(year, month),
        });
        res.json(newDeduct);
      }
    } else {
      await oldEx.update({
        ...req.body,
        startDate: new Date(req.body.startYear, req.body.startMonth - 1),
        endDate: req.body.endYear
          ? new Date(req.body.endYear, req.body.endMonth - 1) - 1
          : null,
      });
      res.json(oldEx);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const expense = await MonthlyExpense.create({
      ...req.body,
      userId: req.user.id,
      startDate: new Date(req.body.startYear, req.body.startMonth - 1),
      endDate: req.body.endYear
        ? new Date(req.body.endYear, req.body.endMonth - 1)
        : null,
    });
    res.json(expense);
  } catch (err) {
    next(err);
  }
});
