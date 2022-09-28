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

  const [view, setView] = useState({
    custom: false,
    showRange: false,
    count: 6,
    startMonth: null,
    startYear: null,
    endMonth: null,
    endYear: null,
  });

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
      labels: rawData.labels,
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

    const reactHighestPoint = [
      ...result.datasets[1].data,
      ...result.datasets[0].data,
    ].reduce((curr, item) => (curr > item ? curr : item), 0);
    return [result, reactHighestPoint];
  }

  useEffect(() => {
    if (!view.custom) {
      dispatch(homeSetLoading(true));
      dispatch(fetchChartData(view));
    } else {
      dispatch(homeSetLoading(true));
      dispatch(fetchChartData(view));
    }
  }, [view.count, view.custom, categories, dailies]);

  useEffect(() => {
    setData(getReactChartData(view.count, year, month));
  }, [rawData]);

  function handleViewChange(evt) {
    const { value } = evt.target;
    if (value !== 'custom') {
      setView((prevView) => ({
        ...prevView,
        custom: false,
        showRange: false,
        count: value,
      }));
    } else {
      setView((prevView) => ({
        ...prevView,
        showRange: true,
      }));
    }
  }

  function handleSetRange() {
    setView((prevView) => ({
      ...prevView,
      custom: true,
    }));
  }

  function handleDateRangeChange(evt) {
    let { name, value } = evt.target;
    value = new Date(value);
    value.setDate(value.getDate() + 15);
    const newVal = new Date(value);
    if (name === 'start') {
      setView((prevView) => ({
        ...prevView,
        startMonth: newVal.getMonth() + 1,
        startYear: newVal.getFullYear(),
      }));
    } else {
      setView((prevView) => ({
        ...prevView,
        endMonth: newVal.getMonth() + 1,
        endYear: newVal.getFullYear(),
      }));
    }
  }

  window.view = view;

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
          <option value="custom">Custom...</option>
        </select>
        <div className={view.showRange ? 'custom-date-range' : 'disabled'}>
          <p>from</p>
          <input name="start" type="month" onChange={handleDateRangeChange} />
          <p> to </p>
          <input name="end" type="month" onChange={handleDateRangeChange} />
          <button
            disabled={
              view.startYear &&
              view.endYear &&
              new Date(view.endYear, view.endMonth) >
                new Date(view.startYear, view.startMonth)
                ? false
                : true
            }
            onClick={handleSetRange}
          />
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
