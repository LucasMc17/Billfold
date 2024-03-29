const router = require('express').Router();
const {
  models: { Category, DailyExpense },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const today = new Date(year, month, 15);
    const categories = await Category.findAll({
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
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    res.json(category);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldCat = await Category.findByPk(id);
    await oldCat.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldCat = await Category.findByPk(id);
    if (req.body.changeDate) {
      const changeDate = new Date(req.body.changeDate);
      const month = changeDate.getMonth();
      const year = changeDate.getFullYear();
      if (oldCat.startMonth === month + 1 && oldCat.startYear === year) {
        await oldCat.update(req.body);
        res.json([oldCat, null]);
      } else {
        await oldCat.update({
          endMonth: month + 1,
          endYear: year,
          endDate: new Date(year, month) - 1,
        });
        const newCat = await Category.create({
          ...req.body,
          id: null,
          startMonth: month + 1,
          startYear: year,
          startDate: new Date(year, month),
        });
        const dailies = await DailyExpense.findAll({
          where: {
            categoryId: oldCat.id,
          },
        });
        dailies.forEach((daily) => {
          if (daily.date > changeDate) {
            daily.setCategory(newCat);
          }
        });
        res.json([oldCat, newCat]);
      }
    } else {
      const startDate = new Date(req.body.startYear, req.body.startMonth - 1);
      const endDate = req.body.endYear
        ? new Date(req.body.endYear, req.body.endMonth - 1) - 1
        : null;
      await oldCat.update({
        ...req.body,
        startDate,
        endDate,
      });
      const dailies = await DailyExpense.findAll({
        where: {
          categoryId: oldCat.id,
        },
      });
      dailies.forEach((daily) => {
        if (daily.date < startDate || (endDate && daily.date > endDate)) {
          daily.setCategory(null);
        }
      });
      res.json([oldCat, null]);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const category = await Category.create({
      ...req.body,
      userId: req.user.id,
      startDate: new Date(req.body.startYear, req.body.startMonth - 1),
      endDate: req.body.endYear
        ? new Date(req.body.endYear, req.body.endMonth - 1)
        : null,
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
});
