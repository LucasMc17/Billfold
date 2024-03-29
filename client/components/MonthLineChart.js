import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chart } from 'react-chartjs-2';
import useFormatters from './custom_hooks/useFormatters';
const { seperateActive } = useFormatters();
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Filler,
} from 'chart.js';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController,
  Filler
);

export default function MonthLineChart({
  dailyExpenses,
  month,
  year,
  budget,
  flexBudget,
}) {
  const allCategories = useSelector((state) => state.allCategories);

  const [chartCategory, setChartCategory] = useState('#special#billfold#all#');
  const [activeCategories, setActiveCategories] = useState([]);
  const [reactChartData, setReactChartData] = useState([
    {
      labels: ['Total'],
      datasets: [
        {
          type: 'line',
          label: 'Budget',
          data: [],
          borderColor: 'gray',
        },
        {
          type: 'line',
          label: 'Percent Spent',
          data: [],
          backgroundColor: '#93e9be',
        },
      ],
    },
    100,
  ]);

  useEffect(() => {
    const categories = seperateActive(
      allCategories,
      new Date(year, month - 1, 15)
    )[0];
    setActiveCategories(categories);
    setReactChartData(getLineChartData(categories, budget, flexBudget));
  }, [dailyExpenses, month, year, chartCategory, budget, flexBudget]);

  function getLineChartData(activeCategories, budget, flexBudget) {
    const cat = activeCategories.find((c) => c.id == chartCategory);
    const cap = cat
      ? cat.amount
        ? cat.amount
        : cat.percent * flexBudget
      : budget;
    const dailies = dailyExpenses.filter(
      (daily) => daily.month == month && daily.year == year
    );
    const daysInMonth = new Date(year, month, 0).getDate();
    const data = [];
    let sum = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const newSum = dailies
        .filter((daily) => {
          if (
            daily.day == i &&
            (daily.categoryId == chartCategory ||
              chartCategory === '#special#billfold#all#')
          ) {
            return true;
          } else {
            return false;
          }
        })
        .reduce((a, b) => a + b.amount, 0);
      sum += newSum;
      data.push(sum);
    }
    const result = {
      labels: Array(daysInMonth)
        .fill(1)
        .map((data, i) => i + 1),
      datasets: [
        {
          type: 'line',
          label: 'Budget Goal',
          data: Array(daysInMonth)
            .fill(0)
            .map((data, i) => (cap / daysInMonth) * (i + 1)),
          borderColor: 'lightgray',
          borderWidth: 2,
        },
        {
          type: 'line',
          label: `${cat ? cat.name : 'All'} spending`,
          data: data,
          borderWidth: 2,
          borderColor: '#93e9be',
          backgroundColor: 'rgba(147, 233, 190, 0.2)',
          tension: 0.2,
          fill: true,
        },
      ],
    };
    const heighestPoint = [
      ...result.datasets[1].data,
      ...result.datasets[0].data,
    ].reduce((datum, highest) => (datum > highest ? datum : highest), 0);
    return [result, heighestPoint];
  }

  function handleCategoryChange(event) {
    const { value } = event.target;
    setChartCategory(value);
  }

  return (
    <div className="chart-container">
      <div id="month-chart-header">
        <h1>Your spending - visualized across the month</h1>
        <div>
          <h3>Filter by Category:</h3>
          <select
            name="category"
            onChange={handleCategoryChange}
            value={chartCategory}
          >
            <option value={'#special#billfold#all#'}>All</option>
            {activeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="loading-screen-container">
        <Chart
          type="line"
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
