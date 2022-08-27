import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import DailyExpense from './DailyExpense';
import {
  fetchCategories,
  fetchDailies,
  fetchExpenses,
  fetchDeducts,
} from '../store';

import { Chart } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarController,
} from 'chart.js';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController
);

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const dailies = useSelector((state) => state.dailyExpenses);
  const [view, setView] = useState(6);
  const [data, setData] = useState([
    {
      labels: [],
      datasets: [
        {
          type: 'bar',
          label: 'Budget',
          data: [],
          color: 'red',
          width: '100%',
        },
        {
          type: 'bar',
          label: 'Dollars Spent',
          data: [],
          backgroundColor: [],
        },
      ],
    },
    100,
  ]);
  const { username, budgetGap, afterExpenses, unassigned } = useData();
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  function handleViewChange(evt) {
    setView(Number(evt.target.value));
  }

  function getReactChartData(num, searchYear, searchMonth) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let result = {
      labels: [],
      datasets: [
        {
          type: 'bar',
          label: 'Budget',
          data: [],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(255, 10, 10, 1)',
          borderWidth: 1,
        },
        {
          type: 'bar',
          label: 'Dollars Spent',
          data: [],
          backgroundColor: [],
        },
      ],
    };
    for (let i = 0; i < num; i++) {
      result.datasets[1].backgroundColor.push('#93e9be');
      result.datasets[1].data.unshift(
        dailies
          .filter(
            (daily) => daily.month === searchMonth && daily.year === searchYear
          )
          .reduce((acc, daily) => acc + daily.amount, 0)
      );
      result.datasets[0].data.unshift(afterExpenses);
      result.labels.unshift(months[searchMonth - 1]);
      searchMonth--;
      if (searchMonth === 0) {
        searchMonth = 12;
        searchYear--;
      }
    }

    const reactHighestPoint = result.datasets[1].data.reduce(
      (curr, item) => (curr > item ? curr : item),
      afterExpenses
    );
    return [result, reactHighestPoint];
  }

  useEffect(() => {
    dispatch(fetchDeducts());
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
    dispatch(fetchDailies());
  }, []);

  useEffect(() => {
    const reactChartData = getReactChartData(view, year, month);
    setData(reactChartData);
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
      <div id="welcome">
        <h1>Welcome back to Billfold, {username}.</h1>
        <div id="status">
          <div id="exc">!</div>
          <h2>{warning}</h2>
        </div>
        <Link to={`/year/${year}/month/${month}`}>
          <button type="button">Show Me This Month</button>
        </Link>
        <Link to={`/year/${lastMonthYear}/month/${lastMonth}`}>
          <button type="button">Show Me Last Month</button>
        </Link>
        <Link to={'/all-months'}>
          <button type="button">Show Me All Months</button>
        </Link>
      </div>
      <div id="recent-purchases">
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
        <div id="home-chart-header">
          <h2>Your spending - visualized</h2>
          <h3>Change chart range</h3>
          <select defaultValue={'6'} onChange={handleViewChange}>
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>
        <Chart
          id="home-chart"
          type="bar"
          data={data[0]}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: data[1] * 1.1,
              },
              x: {
                stacked: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
