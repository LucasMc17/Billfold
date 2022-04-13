import { useSelector } from 'react-redux';
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

export default function useData() {
  const username = useSelector((state) => state.auth.username);
  const income = useSelector((state) => state.auth.income);
  const deducts = useSelector((state) => state.yearlyDeductions);
  const afterDeducts =
    income -
    deducts.reduce((acc, de) => acc + (de.amount || de.percent * income), 0);
  const monthlyNet = afterDeducts / 12;
  const expenses = useSelector((state) => state.monthlyExpenses);
  const afterExpenses =
    monthlyNet -
    expenses.reduce(
      (acc, ex) => acc + (ex.amount || ex.percent * monthlyNet),
      0
    );
  const categories = useSelector((state) => state.categories);
  const fixedCats = categories.filter((cat) => cat.rule === 'FIXED');
  const afterFixedCats =
    afterExpenses - fixedCats.reduce((acc, cat) => acc + cat.amount, 0);
  const unfixedCats = categories.filter((cat) => cat.rule === 'PERCENT');
  const dailies = useSelector((state) => state.dailyExpenses);
  const budgetGap =
    afterExpenses -
    dailies
      .filter((daily) => daily.month === month && daily.year === year)
      .reduce((acc, daily) => acc + daily.amount, 0);
  return {
    username,
    income,
    deducts,
    afterDeducts,
    monthlyNet,
    expenses,
    afterExpenses,
    categories,
    fixedCats,
    afterFixedCats,
    unfixedCats,
    dailies,
    budgetGap,
  };
}
