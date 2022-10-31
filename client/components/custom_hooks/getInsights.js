import useFormaters from './useFormatters';
import { useSelector } from 'react-redux';
const { seperateActive } = useFormaters();
import useData from './useData';
const today = new Date();
const month = today.getMonth() + 1;
const year = today.getFullYear();
import { uid } from 'uid';

export default function getInsights() {
  const incomes = useSelector((state) => state.allIncomes);
  const deducts = useSelector((state) => state.allDeducts);
  const expenses = useSelector((state) => state.allExpenses);
  const fixedCats = useSelector((state) => state.allCategories).filter(
    (cat) => cat.rule === 'FIXED'
  );
  const data = useData();
  const { categories, dailies } = data;

  function getData(cat, dailyExpenses) {
    const monthsActive = month - cat.startMonth + (year - cat.startYear) * 12;
    const relevantDailies = dailyExpenses.filter(
      (daily) =>
        new Date(daily.date) >= new Date(cat.startDate) &&
        !(daily.month === month && daily.year === year) &&
        cat.id === daily.categoryId
    );
    const lastMonths = [];
    let qMonth = month,
      qYear = year;
    for (let i = monthsActive; i > 0; i--) {
      if (qMonth === 1) {
        qYear--;
        qMonth = 12;
      } else {
        qMonth--;
      }
      let budget;
      if (cat.rule === 'FIXED') {
        budget = cat.amount;
      } else {
        const qIncomes = seperateActive(
            incomes,
            new Date(qYear, qMonth - 1)
          )[0],
          qDeducts = seperateActive(deducts, new Date(qYear, qMonth - 1))[0],
          qExpenses = seperateActive(expenses, new Date(qYear, qMonth - 1))[0],
          qFixedCats = seperateActive(
            fixedCats,
            new Date(qYear, qMonth - 1)
          )[0];
        const qIncome = qIncomes.reduce((a, b) => a + b.amount, 0);
        const qAfterYearlies =
          qDeducts.reduce(
            (acc, de) => acc - (de.amount || de.percent * acc),
            qIncome
          ) / 12;
        const qAfterMonthlies = qExpenses.reduce(
          (acc, ex) => acc - (ex.amount || ex.percent * acc),
          qAfterYearlies
        );
        const qAfterFixedCats = qFixedCats.reduce(
          (acc, cat) => acc - cat.amount,
          qAfterMonthlies
        );
        budget = qAfterFixedCats * cat.percent;
      }
      const spent = relevantDailies
        .filter((daily) => daily.year === qYear && daily.month === qMonth)
        .reduce((acc, daily) => acc + daily.amount, 0);
      lastMonths.push({
        spent,
        budget,
        ratio: spent / budget,
      });
    }
    const averages = {
      spentPerMonth:
        relevantDailies.reduce((a, b) => a + b.amount, 0) / monthsActive,
      budgetPerMonth: cat.amount || cat.percent,
    };
    return {
      name: cat.name,
      lastMonths,
      averages,
      monthsActive,
    };
  }

  function formatInsights(array) {
    array.forEach((item) => {
      item.id = uid();
      let suggestion;
      if (item.lastMonths[0].ratio <= 0.85) {
        suggestion = 'UNDERSPENT';
        item.suggestion = suggestion;
      } else if (item.lastMonths[0].ratio >= 1.15) {
        suggestion = 'OVERSPENT';
        item.suggestion = suggestion;
      } else {
        item.lastMonths = [];
      }
      if (suggestion) {
        for (let i = 1; i < item.lastMonths.length; i++) {
          if (suggestion === 'UNDERSPENT') {
            if (item.lastMonths[i].ratio > 0.85) {
              item.lastMonths = item.lastMonths.slice(0, i);
              break;
            } else {
              continue;
            }
          } else if (suggestion === 'OVERSPENT') {
            if (item.lastMonths[i].ratio < 1.15) {
              item.lastMonths = item.lastMonths.slice(0, i);
              break;
            } else {
              continue;
            }
          }
        }
      }
    });
    return array.filter((item) => item.lastMonths.length >= 3);
  }

  const extantCategories = categories.filter(
    (cat) => today.getTime() - new Date(cat.startDate).getTime() > 7776000000
  );
  const masterFunction = () => {
    return formatInsights(extantCategories.map((cat) => getData(cat, dailies)));
  };
  return masterFunction;
}