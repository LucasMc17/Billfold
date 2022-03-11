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
      },
    });
    res.json(dailies);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: {
        name: req.body.category,
      },
    });
    const daily = await DailyExpense.create({
      ...req.body,
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
