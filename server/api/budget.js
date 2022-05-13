const router = require('express').Router();
const {
  models: { Budget },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const budgets = Budget.findAll({
      where: {
        userId: req.user.id
      }
    })
    res.json(budgets)
  } catch (error) {
    next(error)
  }
})
