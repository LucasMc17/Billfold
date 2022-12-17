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
  const dailies = useSelector((state) => state.dailyExpenses);
  const rawData = useSelector((state) => state.homeChartData);
  const loading = useSelector((state) => state.loading.homeChart);

  const tut = useSelector((state) => state.showTutorial);

  const dispatch = useDispatch();
  const [initStartYear, initStartMonth] = getMonthsAgo(
    new Date(year, month, 15),
    6
  );

  const [view, setView] = useState({
    showRange: false,
    stagingStartMonth: initStartMonth,
    stagingStartYear: initStartYear,
    stagingEndMonth: month,
    stagingEndYear: year,
    startMonth: initStartMonth,
    startYear: initStartYear,
    endMonth: month,
    endYear: year,
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

  function getReactChartData() {
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
    dispatch(homeSetLoading(true));
    dispatch(fetchChartData(view));
  }, [view.startMonth, view.startYear, view.endMonth, view.endYear, dailies]);

  useEffect(() => {
    setData(getReactChartData());
  }, [rawData]);

  function getMonthsAgo(date, num) {
    date.setMonth(date.getMonth() - num);
    return [date.getFullYear(), date.getMonth() + 1];
  }

  function handleViewChange(evt) {
    const { value } = evt.target;
    if (value !== 'custom') {
      const [stagingStartYear, stagingStartMonth] = getMonthsAgo(
        new Date(year, month, 15),
        Number(value)
      );
      setView((prevView) => ({
        ...prevView,
        showRange: false,
        stagingEndMonth: month,
        endMonth: month,
        stagingEndYear: year,
        endYear: year,
        stagingStartYear,
        startYear: stagingStartYear,
        stagingStartMonth,
        startMonth: stagingStartMonth,
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
      startMonth: prevView.stagingStartMonth,
      startYear: prevView.stagingStartYear,
      endMonth: prevView.stagingEndMonth,
      endYear: prevView.stagingEndYear,
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
        stagingStartMonth: newVal.getMonth() + 1,
        stagingStartYear: newVal.getFullYear(),
      }));
    } else {
      setView((prevView) => ({
        ...prevView,
        stagingEndMonth: newVal.getMonth() + 1,
        stagingEndYear: newVal.getFullYear(),
      }));
    }
  }

  window.now = new Date();

  console.log(data);

  return tut ? (
    <div className={tut === 8 ? 'chart-container tut-flag' : 'chart-container'}>
      <div id="home-chart-header">
        <h2>Your spending - visualized</h2>
        <h3>Change chart range</h3>
        <select defaultValue={'6'}>
          <option value="3">Past 3 months</option>
          <option value="6">Past 6 months</option>
          <option value="12">Past 12 months</option>
          <option value="18">Past 18 months</option>
          <option value="custom">Custom range...</option>
        </select>
      </div>
      <div id="loading-screen-container">
        <Chart
          id="home-chart"
          type="bar"
          data={{
            datasets: [
              {
                type: 'bar',
                label: 'Budget',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(255, 10, 10, 1)',
                borderWidth: 1,
                data: [2256.88, 2256.88, 2256.88, 2256.88, 2256.88, 2256.88],
              },
              {
                type: 'bar',
                label: 'Dollars Spent',
                backgroundColor: '#93e9be',
                data: [2000, 3125, 2250, 1673, 1798, 100.75],
              },
            ],
            labels: [
              'Jul, 2021',
              'Aug, 2021',
              'Sep, 2021',
              'Oct, 2021',
              'Nov, 2021',
              'Dec, 2021',
            ],
          }}
          options={{
            scales: {
              y: {
                max: 3437.5,
              },
              x: {
                stacked: true,
              },
            },
          }}
        />
      </div>
      {tut === 8 ? <h1 className="tut-num">2</h1> : <></>}
    </div>
  ) : (
    <div className="chart-container">
      <div id="home-chart-header">
        <h2>Your spending - visualized</h2>
        <h3>Change chart range</h3>
        <select defaultValue={'6'} onChange={handleViewChange}>
          <option value="3">Past 3 months</option>
          <option value="6">Past 6 months</option>
          <option value="12">Past 12 months</option>
          <option value="18">Past 18 months</option>
          <option value="custom">Custom range...</option>
        </select>
        <div className={view.showRange ? 'custom-date-range' : 'disabled'}>
          <p>from</p>
          <input
            name="start"
            type="month"
            value={`${view.stagingStartYear}-${String(
              view.stagingStartMonth
            ).padStart(2, '0')}`}
            onChange={handleDateRangeChange}
          />
          <p> to </p>
          <input
            name="end"
            type="month"
            value={`${view.stagingEndYear}-${String(
              view.stagingEndMonth
            ).padStart(2, '0')}`}
            onChange={handleDateRangeChange}
          />
          <p
            className={`nav-button${
              view.stagingStartYear &&
              view.stagingEndYear &&
              new Date(view.stagingEndYear, view.stagingEndMonth) >
                new Date(view.stagingStartYear, view.stagingStartMonth)
                ? ''
                : ' no-op'
            }`}
            onClick={handleSetRange}
          >
            Set
          </p>
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
