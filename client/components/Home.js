import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import useToday from './custom_hooks/useToday';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import { drawChart, clearChart } from './HomeChart';
import {
  fetchDeducts,
  fetchExpenses,
  fetchCategories,
  fetchDailies,
} from '../store';

const { dollarFormat } = useFormatters();

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const dailies = useSelector((state) => state.dailyExpenses);
  useEffect(() => {
    dispatch(fetchDeducts());
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
    dispatch(fetchDailies());
  }, []);
  const { username, budgetGap } = useData();
  const { month, year } = useToday();
  let chartData = [];
  for (let i = 0; i < 6; i++) {
    chartData.push({
      spent: dailies
        .filter((daily) => daily.month === month - i)
        .reduce((acc, daily) => acc + daily.amount, 0),
    });
  }
  clearChart();
  console.log(chartData);
  drawChart(300, 1000, chartData);
  let lastMonthYear, lastMonth;
  if (month === 1) {
    lastMonthYear = year - 1;
    lastMonth = 12;
  } else {
    lastMonthYear = year;
    lastMonth = month - 1;
  }
  let warning;
  if (budgetGap > 100) {
    warning = `You're under budget so far this month!`;
  } else if (budgetGap <= 100 && budgetGap > 0) {
    warning = `You're almost at your budget for this month!`;
  } else if (budgetGap <= 0 && budgetGap > -100) {
    warning = `You're a little bit over budget this month!`;
  } else if (budgetGap <= -100) {
    warning = `You're significantly over budget this month!`;
  }

  return (
    <div>
      <h1>Welcome back to Billfold, {username}.</h1>
      <Link to={`/year/${year}/month/${month}`}>
        <button type="button">Show Me This Month</button>
      </Link>
      <Link to={`/year/${lastMonthYear}/month/${lastMonth}`}>
        <button type="button">Show Me Last Month</button>
      </Link>
      <div>
        <h2>{warning}</h2>
      </div>
      <div>
        <h2>Recent purchases</h2>
        {dailies
          .sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
          })
          .slice(Math.max(dailies.length - 5, 0))
          .map((daily) => (
            <div className="daily" key={daily.id}>
              <h3>{daily.name}</h3>
              <p>{daily.category.name}</p>
              <p>{dollarFormat(daily.amount)}</p>
              <p>
                {daily.month}/{daily.day}
              </p>
            </div>
          ))}
        {categories.length ? <NewDailyForm categories={categories} /> : <div />}
      </div>
      <div id="home-chart"></div>
    </div>
  );
}
