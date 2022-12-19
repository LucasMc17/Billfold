import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CatSummary from './CatSummary';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import DailyExpense from './DailyExpense';
import { Link } from 'react-router-dom';
import { fetchMonthChartData, monthSetLoading } from '../store';

import getInsightGrabber from './custom_hooks/getInsights';
import { setInsights } from '../store';

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
  const dispatch = useDispatch();

  const getInsights = getInsightGrabber();
  const [reactChartData, setReactChartData] = useState([
    {
      labels: ['Total'],
      datasets: [
        {
          type: 'bar',
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
  const [date, setDate] = useState(new Date());
  const [metric, setMetric] = useState('PERCENT');
  const [filter, setFilter] = useState({
    filterCat: '#special#billfold#all#',
    filterFunc(array) {
      return array;
    },
  });
  const { dollarFormat, fixedDec } = useFormatters();
  const data = useData(date);
  const { year, month } = useParams();
  const tut = useSelector((state) => state.showTutorial);
  const dailyExpenses = useSelector((state) => state.dailyExpenses);
  const dailies = dailyExpenses.filter(
    (ex) => ex.month === Number(month) && ex.year === Number(year)
  );
  const totalSpent = dailies.reduce((acc, daily) => acc + daily.amount, 0);
  const { categories } = data;
  const rawData = useSelector((state) => state.monthChartData);
  const loading = useSelector((state) => state.loading.monthChart);

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

  const handleMetricChange = () => {
    if (metric === 'PERCENT') {
      setMetric('AMOUNT');
    } else {
      setMetric('PERCENT');
    }
  };

  function reactGetChartData() {
    const result = {
      labels: rawData.labels,
      datasets: [
        {
          type: 'bar',
          label: 'Budget',
          data: rawData.budgets,
          borderColor: 'rgba(255, 10, 10, 1)',
          borderWidth: 1,
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        {
          type: 'bar',
          label: `${metric === 'AMOUNT' ? 'Amount' : 'Percent'} Spent`,
          data: rawData.spents,
          backgroundColor: '#93e9be',
        },
      ],
    };
    const heighestPoint = [
      ...result.datasets[1].data,
      ...result.datasets[0].data,
    ].reduce((datum, highest) => (datum > highest ? datum : highest), 0);
    return [result, heighestPoint];
  }

  useEffect(() => {
    dispatch(monthSetLoading(true));
    dispatch(fetchMonthChartData(year, month, metric));
  }, [dailyExpenses, month, year, metric]);

  useEffect(() => {
    setReactChartData(reactGetChartData());
  }, [rawData]);

  useEffect(() => {
    setDate(new Date(year, month - 1, 15));
  }, [year, month]);

  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, [dailyExpenses]);

  return tut ? (
    <div>
      <div id="month-overview">
        <div id="month-header">
          <h1 className="arrow">{'<<'}</h1>
          <h1>December, 2021</h1>
          <h1 className="arrow">{'>>'}</h1>
        </div>
        <h1>Categories Overview</h1>
        <div id="summaries">
          <div className="summary total">
            <h2>Total</h2>
            <h3>BUDGET: $2,256.88</h3>
            <h3>SPENT: $100.75</h3>
            <h3>4.46%</h3>
          </div>
          <div className="summary">
            <h2>Laundry</h2>
            <h3>BUDGET: $100.00</h3>
            <h3>SPENT: $35.00</h3>
            <h3>35%</h3>
          </div>
          <div className="summary">
            <h2>Subway</h2>
            <h3>BUDGET: $50.00</h3>
            <h3>SPENT: $2.75</h3>
            <h3>5.5%</h3>
          </div>
          <div className="summary">
            <h2>Food</h2>
            <h3>BUDGET: $842.78</h3>
            <h3>SPENT: $40.00</h3>
            <h3>4.75%</h3>
          </div>
          <div className="summary">
            <h2>Fun</h2>
            <h3>BUDGET: $526.72</h3>
            <h3>SPENT: $15.00</h3>
            <h3>2.85%</h3>
          </div>
          <div className="summary">
            <h2>Home goods</h2>
            <h3>BUDGET: $421.38</h3>
            <h3>SPENT: $0.00</h3>
            <h3>0%</h3>
          </div>
          <div className="summary">
            <h2>Self care</h2>
            <h3>BUDGET: $316.03</h3>
            <h3>SPENT: $8.00</h3>
            <h3>2.53%</h3>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div id="month-chart-header">
          <h1>Your spending - visualized</h1>
          <div>
            <h3>Show by:</h3>
            <div className="nav-button toggle-container">
              <div className="toggle-switch">
                <div
                  className={metric === 'PERCENT' ? 'toggle-off' : 'toggle-on'}
                ></div>
              </div>
            </div>
            <h3>{metric}</h3>
          </div>
        </div>
        <div id="loading-screen-container">
          <Chart
            type="bar"
            data={{
              labels: [
                'Laundry',
                'Subway',
                'Food',
                'Fun',
                'Home goods',
                'Self care',
                'Total',
              ],
              datasets: [
                {
                  type: 'bar',
                  label: 'Budget',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(255, 10, 10, 1)',
                  borderWidth: 1,
                  data: [100, 100, 100, 100, 100, 100, 100],
                },
                {
                  type: 'bar',
                  label: 'Percent Spent',
                  backgroundColor: '#93e9be',
                  data: [35, 5.5, 4.75, 2.85, 0, 2.53, 4.46],
                },
              ],
            }}
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
        <DailyExpense
          daily={{
            name: 'Dry cleaning',
            amount: 35,
            month: 12,
            day: 1,
            category: { name: 'Laundry' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'Subway home',
            amount: 2.75,
            month: 12,
            day: 2,
            category: { name: 'Subway' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'Movie',
            amount: 15,
            month: 12,
            day: 3,
            category: { name: 'Fun' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'Groceries',
            amount: 40,
            month: 12,
            day: 4,
            category: { name: 'Food' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'shampoo',
            amount: 8,
            month: 12,
            day: 5,
            category: { name: 'Self care' },
          }}
        />
        <NewDailyForm
          defaultDate={new Date(year, month - 1).toISOString().split('T')[0]}
        />
      </div>
    </div>
  ) : (
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
          {categories.length ? (
            categories.map((cat) => (
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
          <div>
            <h3>Show by:</h3>
            <div
              className="nav-button toggle-container"
              onClick={handleMetricChange}
            >
              <div className="toggle-switch">
                <div
                  className={metric === 'PERCENT' ? 'toggle-off' : 'toggle-on'}
                ></div>
              </div>
            </div>
            <h3>{metric}</h3>
          </div>
        </div>
        <div id="loading-screen-container">
          {loading ? (
            <div id="loading-screen">
              <h2>Loading...</h2>
              <img id="load-icon" src="/load-icon.png" />
            </div>
          ) : (
            <></>
          )}
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
          defaultDate={new Date(year, month - 1).toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
}
