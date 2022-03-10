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
