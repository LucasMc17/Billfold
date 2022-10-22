const router = require('express').Router();
const {
  models: { Income },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

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
