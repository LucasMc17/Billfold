const router = require('express').Router();
const {
  models: { YearlyDeduction },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const deducts = await YearlyDeduction.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(deducts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params
    const deduct = await YearlyDeduction.findByPk(id);
    res.json(deduct);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduct = await YearlyDeduction.findByPk(id);
    await deduct.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduct = await YearlyDeduction.findByPk(id);
    await deduct.update(req.body);
    res.json(deduct);
  } catch (err) {
    next(err);
  }
});
