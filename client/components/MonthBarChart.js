import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMonthChartData, monthSetLoading } from '../store';
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

export default function MonthBarChart({
  dailyExpenses,
  month,
  year,
  tutorial,
}) {
  const dispatch = useDispatch();

  const [metric, setMetric] = useState('PERCENT');
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

  const rawData = useSelector((state) => state.monthChartData);
  const loading = useSelector((state) => state.loading.monthChart);

  useEffect(() => {
    dispatch(monthSetLoading(true));
    dispatch(fetchMonthChartData(year, month, metric));
  }, [dailyExpenses, month, year, metric]);

  useEffect(() => {
    setReactChartData(reactGetChartData());
  }, [rawData]);

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

  return tutorial ? (
    <div className="chart-container">
      <div id="month-chart-header">
        <h1>Your spending - visualized by category</h1>
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
                max: 110,
              },
              x: {
                stacked: true,
              },
            },
          }}
        />
      </div>
    </div>
  ) : (
    <div className="chart-container">
      <div id="month-chart-header">
        <h1>Your spending - visualized by category</h1>
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
                max: Math.round(reactChartData[1] * 1.1),
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
