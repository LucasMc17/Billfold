const router = require('express').Router();
const {
  models: { InsightIgnore },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const ignores = await InsightIgnore.findAll({
      userId: req.user.id,
    });
    res.json(ignores);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const ignore = await InsightIgnore.create({
      ...req.body,
    });
    res.json(ignore);
  } catch (err) {
    next(err);
  }
});
