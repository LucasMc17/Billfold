const router = require('express').Router();
const {
  models: { Income },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

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
        [Op.or]: [
          {
            endDate: {
              [Op.gt]: date,
            },
          },
          { endDate: null },
        ],
      },
      order: [['startDate', 'DESC']],
    });
    const sum = result.reduce((a, b) => a + b.amount, 0);
    res.json(sum);
  } catch (err) {
    next(err);
  }
});
