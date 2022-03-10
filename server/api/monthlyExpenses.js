const router = require('express').Router();
const {
  models: { MonthlyExpense },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const expenses = await MonthlyExpense.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const ex = await MonthlyExpense.findByPk(id);
    await ex.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});
