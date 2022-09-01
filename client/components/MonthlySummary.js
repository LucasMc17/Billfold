import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CatSummary from './CatSummary';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import DailyExpense from './DailyExpense';
import { Link } from 'react-router-dom';

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

const monthTable = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export default function MonthlySummary() {
  const [reactChartData, setReactChartData] = useState([
    {
      labels: ['Total'],
      datasets: [
        {
          type: 'line',
          label: 'Budget',
          data: [],
          borderColor: 'red',
        },
        {
          type: 'bar',
          label: 'Percent Spent',
          data: [],
          backgroundColor: '#93e9be',
        },
      ],
    },
    100,
  ]);
  const [filter, setFilter] = useState({
    filterCat: '#special#billfold#all#',
    filterFunc(array) {
      return array;
    },
  });
  const { dollarFormat, fixedDec } = useFormatters();
  const data = useData();
  const { year, month } = useParams();
  const dailyExpenses = useSelector((state) => state.dailyExpenses);
  const dailies = dailyExpenses.filter(
    (ex) => ex.month === Number(month) && ex.year === Number(year)
  );
  const totalSpent = dailies.reduce((acc, daily) => acc + daily.amount, 0);
  const categories = useSelector((state) => state.categories);

  const handleFilter = (event) => {
    if (event.target.value === '#special#billfold#all#') {
      setFilter({
        filterCat: event.target.value,
        filterFunc(array) {
          return array;
        },
      });
    } else {
      setFilter({
        filterCat: event.target.value,
        filterFunc(array) {
          return array.filter((a) => a.category.name === this.filterCat);
        },
      });
    }
  };

  function reactGetChartData() {
    const result = {
      labels: [...categories.map((cat) => cat.name), 'Total'],
      datasets: [
        {
          type: 'bar',
          label: 'Budget',
          data: Array(categories.length + 1).fill(100),
          borderColor: 'rgba(255, 10, 10, 1)',
          borderWidth: 1,
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        {
          type: 'bar',
          label: 'Percent Spent',
          data: [],
          backgroundColor: '#93e9be',
        },
      ],
    };
    result.labels.forEach((label, i) => {
      if (i === result.labels.length - 1) {
        result.datasets[1].data.push((totalSpent / data.afterExpenses) * 100);
      } else {
        const catBudget =
          categories[i].amount || categories[i].percent * data.afterFixedCats;
        const catTotal =
          (dailies
            .filter((daily) => daily.category.name === label)
            .reduce((a, b) => a + b.amount, 0) /
            catBudget) *
          100;
        result.datasets[1].data.push(catTotal);
      }
    });
    const heighestPoint = result.datasets[1].data.reduce(
      (datum, highest) => (datum > highest ? datum : highest),
      100
    );
    return [result, heighestPoint];
  }

  useEffect(() => {
    const reactData = reactGetChartData();
    setReactChartData(reactData);
  }, [dailyExpenses, month, year]);

  return (
    <div>
      <div id="month-overview">
        <div id="month-header">
          {Number(month) === 1 ? (
            <Link to={`/year/${Number(year) - 1}/month/12`}>
              <h1 className="arrow">{'<<'}</h1>
            </Link>
          ) : (
            <Link to={`/year/${year}/month/${Number(month) - 1}`}>
              <h1 className="arrow">{'<<'}</h1>
            </Link>
          )}
          <h1>
            {monthTable[month]}, {year}
          </h1>
          {Number(month) === 12 ? (
            <Link to={`/year/${Number(year) + 1}/month/1`}>
              <h1 className="arrow">{'>>'}</h1>
            </Link>
          ) : (
            <Link to={`/year/${year}/month/${Number(month) + 1}`}>
              <h1 className="arrow">{'>>'}</h1>
            </Link>
          )}
        </div>
        <h1>Categories Overview</h1>
        <div id="summaries">
          <div className="summary total">
            <h2>Total</h2>
            <h3>BUDGET: {dollarFormat(data.afterExpenses)}</h3>
            <h3 className={totalSpent > data.afterExpenses ? 'warning' : ''}>
              SPENT: {dollarFormat(totalSpent)}
            </h3>
            <h3 className={totalSpent > data.afterExpenses ? 'warning' : ''}>
              {fixedDec((totalSpent / data.afterExpenses) * 100)}%
            </h3>
          </div>
          {data.categories.length ? (
            data.categories.map((cat) => (
              <div className="summary" key={cat.id}>
                <CatSummary cat={cat} month={month} year={year} />
              </div>
            ))
          ) : (
            <h2>You've got no active expense categories! Go make some!</h2>
          )}
        </div>
      </div>
      <div className="chart-container">
        <div id="month-chart-header">
          <h1>Your spending - visualized</h1>
        </div>
        <Chart
          type="bar"
          data={reactChartData[0]}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: reactChartData[1] * 1.1,
              },
              x: {
                stacked: true,
              },
            },
          }}
        />
      </div>
      <div id="monthly-purchases">
        <div id="monthly-purchases-header">
          <h1>Your Purchases</h1>
          <div>
            <label>Filter: </label>
            <select onChange={handleFilter}>
              <option value={'#special#billfold#all#'}>All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {dailies.length ? (
          filter
            .filterFunc(dailies)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((daily) => <DailyExpense key={daily.id} daily={daily} />)
        ) : (
          <h2>You have no purchases this month.</h2>
        )}
        <NewDailyForm
          categories={data.categories}
          defaultDate={new Date(year, month - 1).toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
}
