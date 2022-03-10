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
