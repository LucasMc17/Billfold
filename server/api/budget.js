const router = require('express').Router();
const {
  models: { Budget },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(budgets);
  } catch (error) {
    next(error);
  }
});

router.get('/current', requireToken, async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      order: [['date', 'DESC']],
      where: {
        userId: req.user.id,
      },
    });
    res.json(budget);
  } catch (error) {
    next(error)
  }
})

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const cutoff = new Date(year, month + 1);
    const budget = await Budget.findOne({
      order: [['date', 'DESC']],
      where: {
        date: {
          [Op.lt]: cutoff,
        },
        userId: req.user.id,
      },
    });
    res.json(budget);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const today = new Date();
    const budget = await Budget.findOne({
      order: [['date', 'DESC']],
      where: {
        date: {
          [Op.lt]: today,
        },
        userId: req.user.id,
      },
    });
    console.log(budget);
    if (
      budget.month === today.getMonth() + 1 &&
      budget.year === today.getFullYear()
    ) {
      await budget.update({ ...req.body });
      res.json([budget, false]);
    } else {
      delete budget.dataValues.id;
      const newBudget = await Budget.create({
        ...budget.dataValues,
        ...req.body,
        date: today,
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        userId: req.user.id,
      });
      res.json([newBudget, true]);
    }
    // const [budget, created] = await Budget.findOrCreate({
    //   where: {
    //     userId: req.user.id,
    //     month: today.getMonth() + 1,
    //     year: today.getFullYear(),
    //   },
    // });
    // await budget.update({
    //   ...req.body,
    // });
    // res.json([budget, created]);
  } catch (error) {
    next(error);
  }
});
