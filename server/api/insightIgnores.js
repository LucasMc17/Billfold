const router = require('express').Router();
const {
  models: { InsightIgnore },
} = require('../db');
module.exports = router;
const { requireToken } = require('./requireToken');
const { Op } = require('sequelize');

function seperateOld(array) {
  const fresh = [],
    old = [],
    now = new Date();
  for (let ign of array) {
    const date = new Date(ign.ignoredDate);
    if (now.getTime() - date.getTime() > 2592000000) {
      old.push(ign.id);
    } else {
      fresh.push(ign);
    }
  }
  return [fresh, old];
}

router.get('/', requireToken, async (req, res, next) => {
  try {
    const ignores = await InsightIgnore.findAll({
      where: { userId: req.user.id },
    });
    console.log(ignores);
    const [toSend, toDel] = seperateOld(ignores);
    console.log(toSend, toDel);
    await InsightIgnore.destroy({
      where: {
        id: {
          [Op.in]: toDel,
        },
      },
    });
    res.json(toSend);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    const ignore = await InsightIgnore.create({
      ...req.body,
      userId: req.user.id,
    });
    res.json(ignore);
  } catch (err) {
    next(err);
  }
});
