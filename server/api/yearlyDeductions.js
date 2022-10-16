const router = require('express').Router();
const {
  models: { YearlyDeduction },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const today = new Date(year, month, 15);
    const deducts = await YearlyDeduction.findAll({
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
    res.json(deducts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduct = await YearlyDeduction.findByPk(id);
    res.json(deduct);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldDeduct = await YearlyDeduction.findByPk(id);
    await oldDeduct.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldDeduct = await YearlyDeduction.findByPk(id);
    if (req.body.changeDate) {
      const changeDate = new Date(req.body.changeDate);
      const month = changeDate.getMonth();
      const year = changeDate.getFullYear();
      if (oldDeduct.startMonth === month + 1 && oldDeduct.startYear === year) {
        await oldDeduct.update(req.body);
        res.json(oldDeduct);
      } else {
        await oldDeduct.update({
          endMonth: month + 1,
          endYear: year,
          endDate: new Date(year, month) - 1,
        });
        const newDeduct = await YearlyDeduction.create({
          ...req.body,
          id: null,
          startMonth: month + 1,
          startYear: year,
          startDate: new Date(year, month),
        });
        res.json(newDeduct);
      }
    } else {
      await oldDeduct.update({
        ...req.body,
        startDate: new Date(req.body.startYear, req.body.startMonth - 1),
        endDate: req.body.endYear
          ? new Date(req.body.endYear, req.body.endMonth - 1) - 1
          : null,
      });
      res.json(oldDeduct);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const deduct = await YearlyDeduction.create({
      ...req.body,
      userId: req.user.id,
      startDate: new Date(req.body.startYear, req.body.startMonth - 1),
      endDate: req.body.endYear
        ? new Date(req.body.endYear, req.body.endMonth - 1)
        : null,
    });
    res.json(deduct);
  } catch (err) {
    next(err);
  }
});
