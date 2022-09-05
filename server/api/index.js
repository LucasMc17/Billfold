const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/yearly-deductions', require('./yearlyDeductions'));
router.use('/monthly-expenses', require('./monthlyExpenses'));
router.use('/categories', require('./categories'));
router.use('/daily-expenses', require('./dailyExpenses'));
router.use('/incomes', require('./incomes'));
router.use('/chart-data', require('./homeChartData'));
router.use('/month-chart-data', require('./monthChartData'));
router.use('/all-categories', require('./allCategories'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
