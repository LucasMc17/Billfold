import { useSelector } from 'react-redux';
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const day = new Date().getDate();

import useFormatters from './useFormatters';

const { seperateActive } = useFormatters();

export default function useData(date = new Date()) {
  const username = useSelector((state) => state.auth.username);
  const incomes = seperateActive(
    useSelector((state) => state.allIncomes),
    date
  )[0];
  const income = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const deducts = seperateActive(
    useSelector((state) => state.allDeducts),
    date
  )[0];
  const afterDeducts = deducts.reduce(
    (acc, de) => acc - (de.amount || de.percent * acc),
    income
  );
  const monthlyNet = afterDeducts / 12;
  const expenses = seperateActive(
    useSelector((state) => state.allExpenses),
    date
  )[0];
  const afterExpenses = expenses.reduce(
    (acc, ex) => acc - (ex.amount || ex.percent * acc),
    monthlyNet
  );
  const categories = seperateActive(
    useSelector((state) => state.allCategories),
    date
  )[0];
  const fixedCats = categories.filter((cat) => cat.rule === 'FIXED');
  const afterFixedCats =
    afterExpenses - fixedCats.reduce((acc, cat) => acc + cat.amount, 0);
  const unfixedCats = categories.filter((cat) => cat.rule === 'PERCENT');
  const dailies = useSelector((state) => state.dailyExpenses);
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  const budgetGap =
    dailies
      .filter((daily) => daily.month === month && daily.year === year)
      .reduce((acc, daily) => acc + daily.amount, 0) / afterExpenses;
  const monthGap = day / daysInMonth(month, year);
  const onTrack = budgetGap - monthGap;
  const unassigned =
    afterFixedCats -
    unfixedCats.reduce((acc, cat) => acc + cat.percent * afterFixedCats, 0);
  return {
    username,
    income,
    incomes,
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
    unassigned,
    monthGap,
    onTrack,
  };
}
