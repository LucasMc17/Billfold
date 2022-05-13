const router = require('express').Router();
const {
  models: { Budget },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.get('/', requireToken, async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      where: {
        userId: req.user.id
      }
    })
    res.json(budgets)
  } catch (error) {
    next(error)
  }
})

router.post('/', requireToken, async (req, res, next) => {
  try {
    const today = new Date();
    const [budget, created] = await Budget.findOrCreate({
      where: {
        userId: req.user.id,
        month: today.getMonth() + 1,
        year: today.getFullYear()
      }
    })
    await budget.update({
      ...req.body,
    })
    res.json([budget, created])
  } catch (error) {
    next(error)
  }
})
