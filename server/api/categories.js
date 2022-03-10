const router = require('express').Router();
const {
  models: { Category },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});
