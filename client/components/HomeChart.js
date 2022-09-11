import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Chart } from 'react-chartjs-2';
import { fetchChartData, homeSetLoading } from '../store';
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

export default function HomeChart({ year, month, afterExpenses }) {
  const categories = useSelector((state) => state.categories);
  const dailies = useSelector((state) => state.dailyExpenses);
  const rawData = useSelector((state) => state.homeChartData);
  const loading = useSelector((state) => state.loading.homeChart);

  const dispatch = useDispatch();

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
          data: rawData.budgets,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(255, 10, 10, 1)',
          borderWidth: 1,
        },
        {
          type: 'bar',
          label: 'Dollars Spent',
          data: rawData.spents,
          backgroundColor: '#93e9be',
        },
      ],
    };
    for (let i = 0; i < num; i++) {
      result.labels.unshift(months[searchMonth - 1]);
      searchMonth--;
      if (searchMonth === 0) {
        searchMonth = 12;
        searchYear--;
      }
    }

    const reactHighestPoint = [
      ...result.datasets[1].data,
      ...result.datasets[0].data,
    ].reduce((curr, item) => (curr > item ? curr : item), 0);
    return [result, reactHighestPoint];
  }

  useEffect(() => {
    dispatch(homeSetLoading(true));
    dispatch(fetchChartData(view));
  }, [view, categories, dailies]);

  useEffect(() => {
    setData(getReactChartData(view, year, month));
  }, [rawData]);

  function handleViewChange(evt) {
    setView(Number(evt.target.value));
  }

  window.data = data;

  return (
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
      <div id="loading-screen-container">
        {loading ? (
          <div id="loading-screen">
            <h2>Loading...</h2>
          </div>
        ) : (
          <></>
        )}
        <Chart
          id="home-chart"
          type="bar"
          data={data[0]}
          options={{
            scales: {
              y: {
                max: Math.floor(data[1] * 1.1),
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
