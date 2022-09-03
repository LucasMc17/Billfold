import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

export default function HomeChart({ year, month, afterExpenses }) {
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
    const reactChartData = getReactChartData(view, year, month);
    setData(reactChartData);
  }, [categories, dailies, view]);

  function handleViewChange(evt) {
    setView(Number(evt.target.value));
  }

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
  );
}
