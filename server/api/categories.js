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
    console.log('CATS: ', today);
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
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    if (oldCat.startMonth === month + 1 && oldCat.startYear === year) {
      await oldCat.destroy();
    } else {
      await oldCat.update({
        endYear: year,
        endMonth: month + 1,
        endDate: new Date(year, month) - 1,
      });
      const purchases = await DailyExpense.findAll({
        where: {
          categoryId: oldCat.id,
          userId: req.user.id,
          year,
          month: month + 1,
        },
      });
      purchases.forEach((purch) => purch.setCategory(null));
    }
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldCat = await Category.findByPk(id);
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    if (oldCat.startMonth === month + 1 && oldCat.startYear === year) {
      await oldCat.update(req.body);
      res.json(oldCat);
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
      const purchases = await DailyExpense.findAll({
        where: {
          categoryId: oldCat.id,
          userId: req.user.id,
          year,
          month: month + 1,
        },
      });
      purchases.forEach((purch) => purch.setCategory(newCat));
      res.json(newCat);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const category = await Category.create({
      ...req.body,
      userId: req.user.id,
      startMonth: month + 1,
      startYear: year,
      startDate: new Date(year, month),
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
});
