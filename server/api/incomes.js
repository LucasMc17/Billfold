const router = require('express').Router();
const {
  models: { Income },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

router.post('/new-income', requireToken, async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

router.get('/:year/:month', requireToken, async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const date = new Date(year, month, 15);
    const result = await Income.findAll({
      where: {
        userId: req.user.id,
        startDate: {
          [Op.lt]: date,
        },
      },
      order: [['startDate', 'DESC']],
      limit: 1,
    });
    res.json(result[0].amount);
  } catch (err) {
    next(err);
  }
});
