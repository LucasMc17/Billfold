import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import { drawChart, clearChart } from './HomeChart';
import DailyExpense from './DailyExpense';
import {
  fetchCategories,
  fetchDailies,
  fetchExpenses,
  fetchDeducts,
} from '../store';

const { dollarFormat } = useFormatters();

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const dailies = useSelector((state) => state.dailyExpenses);
  const [view, setView] = useState(6);
  const { username, budgetGap, afterExpenses } = useData();
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  function handleViewChange(evt) {
    setView(Number(evt.target.value));
  }

  function getChartData(num, searchYear, searchMonth) {
    let result = [];
    for (let i = 0; i < num; i++) {
      result.push({
        year: searchYear,
        month: searchMonth,
        spent: dailies
          .filter(
            (daily) => daily.month === searchMonth && daily.year === searchYear
          )
          .reduce((acc, daily) => acc + daily.amount, 0),
      });
      searchMonth--;
      if (searchMonth === 0) {
        searchMonth = 12;
        searchYear--;
      }
    }
    const highestPoint = result.reduce(
      (curr, item) => (curr > item.spent ? curr : item.spent),
      0
    );
    return [result, highestPoint];
  }

  useEffect(() => {
    dispatch(fetchDeducts());
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
    dispatch(fetchDailies());
  }, []);

  useEffect(() => {
    const chartData = getChartData(view, year, month);

    clearChart();
    drawChart(
      300,
      1000,
      chartData[0],
      Math.max(chartData[1] * 1.1, afterExpenses * 1.1),
      afterExpenses
    );
  }, [categories, dailies, view]);

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
