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
