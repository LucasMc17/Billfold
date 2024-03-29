const router = require('express').Router();
const {
  models: { DailyExpense, Category },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const dailies = await DailyExpense.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: Category,
        required: false,
      },
    });
    res.json(dailies);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const daily = await DailyExpense.findByPk(id);
    res.json(daily);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const [year, month, day] = req.body.date.split('T')[0].split('-');
    const properDate = new Date(year, month - 1, day);
    const category = await Category.findByPk(req.body.category);
    const daily = await DailyExpense.create({
      ...req.body,
      date: properDate,
      userId: req.user.id,
      categoryId: category.id,
    });
    daily.setCategory(category);
    res.json(
      await DailyExpense.findByPk(daily.id, {
        include: {
          model: Category,
        },
      })
    );
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const daily = await DailyExpense.findByPk(id);
    await daily.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const [year, month, day] = req.body.date.split('-');
    const properDate = new Date(year, month - 1, day);
    const { id } = req.params;
    const daily = await DailyExpense.findByPk(id);
    await daily.update({
      ...req.body,
      date: properDate,
      year,
      month,
      day,
    });
    const result = await DailyExpense.findByPk(daily.id, {
      include: {
        model: Category,
      },
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});
