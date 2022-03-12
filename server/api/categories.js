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

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    res.json(category);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    await cat.destroy();
    res.status(204).send(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    await cat.update(req.body);
    res.json(cat);
  } catch (err) {
    next(err);
  }
});
