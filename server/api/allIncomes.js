const router = require('express').Router();
const {
  models: { Income },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const income = await Income.findByPk(id);
    res.json(income);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireToken, async (req, res, next) => {
  try {
    const incomes = await Income.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(incomes);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldInc = await Income.findByPk(id);
    await oldInc.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const income = await Income.create({
      ...req.body,
      userId: req.user.id,
      startDate: new Date(req.body.startYear, req.body.startMonth - 1),
      endDate: req.body.endYear
        ? new Date(req.body.endYear, req.body.endMonth - 1)
        : null,
    });
    res.json(income);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const income = await Income.findByPk(id);
    console.log(income);
    if (req.body.changeDate) {
      const changeDate = new Date(req.body.changeDate);
      const month = changeDate.getMonth();
      const year = changeDate.getFullYear();
      if (income.startMoth === month + 1 && income.startYear === year) {
        await income.update(req.body);
        res.json([income, null]);
      } else {
        await income.update({
          endMonth: month + 1,
          endYear: year,
          endDate: new Date(year, month) - 1,
        });
        const newIncome = await Income.create({
          ...req.body,
          id: null,
          startMonth: month + 1,
          startYear: year,
          startDate: new Date(year, month),
        });
        res.json([income, newIncome]);
      }
    } else {
      const startDate = new Date(req.body.startYear, req.body.startMonth - 1);
      const endDate = req.body.endYear
        ? new Date(req.body.endYear, req.body.endMonth - 1) - 1
        : null;
      await income.update({
        ...req.body,
        startDate,
        endDate,
      });
      res.json([income, null]);
    }
  } catch (err) {
    next(err);
  }
});
