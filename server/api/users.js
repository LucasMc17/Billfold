const router = require('express').Router();
const {
  models: { User },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');

router.put('/', requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    console.log(user)
    await user.update({ ...req.body });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/myincome', requireToken, async (req, res, next) => {
  try {
    res.json(req.user.income);
  } catch (err) {
    next(err);
  }
});

