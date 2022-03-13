import React, { useEffect, useState } from 'react';
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
import DailyExpense from './DailyExpense';

const { dollarFormat } = useFormatters();

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const dailies = useSelector((state) => state.dailyExpenses);
  const [view, setView] = useState(6);
  useEffect(() => {
    dispatch(fetchDeducts());
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
    dispatch(fetchDailies());
  }, []);
  const { username, budgetGap, afterExpenses } = useData();
  const { month, year } = useToday();

  function handleViewChange(evt) {
    setView(Number(evt.target.value));
  }

  function getChartData(num) {
    let result = [];
    for (let i = 0; i < num; i++) {
      let searchYear = year;
      let searchMonth = month;
      if (month - i < 1) {
        searchMonth = 12 + month - i;
        searchYear = year - 1;
      } else {
        searchMonth = month - i;
      }
      result.push({
        year: searchYear,
        month: searchMonth,
        spent: dailies
          .filter(
            (daily) => daily.month === searchMonth && daily.year === searchYear
          )
          .reduce((acc, daily) => acc + daily.amount, 0),
      });
    }
    return result;
  }

  clearChart();
  drawChart(300, 1000, getChartData(view), afterExpenses);
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
      <Link to={'/all-months'}>
        <button type="button">Show Me All Months</button>
      </Link>
      <div>
        <h2>{warning}</h2>
      </div>
      <div>
        <h2>Recent purchases</h2>
        {dailies
          .slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(Math.max(dailies.length - 5, 0))
          .map((daily) => (
            <DailyExpense key={daily.id} daily={daily} />
          ))}
        {categories.length ? <NewDailyForm categories={categories} /> : <div />}
      </div>
      <div className="chart-container">
        <div id="home-chart" className="chart"></div>
        <h3>Change chart range</h3>
        <select defaultValue={'6'} onChange={handleViewChange}>
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="18">18</option>
        </select>
      </div>
    </div>
  );
}
