import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CatSummary from './CatSummary';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import { drawChart, clearChart } from './MonthChart';
import { fetchCategories, fetchDailies } from '../store';

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
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchDailies());
  }, []);
  const { dollarFormat, fixedDec } = useFormatters();
  const data = useData();
  const dispatch = useDispatch();
  const { year, month } = useParams();
  const dailies = useSelector((state) =>
    state.dailyExpenses.filter(
      (ex) => ex.month === Number(month) && ex.year === Number(year)
    )
  );
  const totalSpent = dailies.reduce((acc, daily) => acc + daily.amount, 0);
  const categories = useSelector((state) => state.categories);
  let chartData = [
    ...categories.map((cat) => {
      const total = cat.amount ? cat.amount : cat.percent * data.afterFixedCats;
      return {
        name: cat.name,
        spent:
          (dailies
            .filter((daily) => daily.categoryId === cat.id)
            .reduce((acc, daily) => acc + daily.amount, 0) /
            total) *
          100,
      };
    }),
    { name: 'Total', spent: (totalSpent / data.afterExpenses) * 100 },
  ];
  clearChart();
  console.log(chartData);
  drawChart(300, 1000, chartData);
  return (
    <div>
      <h1>
        {monthTable[month]}, {year}
      </h1>
      <h1>OVERVIEW</h1>
      <div id="summaries">
        <div className="summary">
          <h2>Total</h2>
          <h3>BUDGET PER MONTH: {dollarFormat(data.afterExpenses)}</h3>
          <p>
            AMOUNT SPENT THIS MONTH: {dollarFormat(totalSpent)} /{' '}
            {fixedDec((totalSpent / data.afterExpenses) * 100)}%
          </p>
        </div>
        {data.categories.length ? (
          data.categories.map((cat) => (
            <div className="summary" key={cat.id}>
              <CatSummary cat={cat} month={month} />
            </div>
          ))
        ) : (
          <h2>You've got no active expense categories! Go make some!</h2>
        )}
      </div>
      <div id="month-chart" />
      <h1>PURCHASES</h1>
      {dailies.length ? (
        dailies
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((daily) => (
            <div className="daily" key={daily.id}>
              <h3>{daily.name}</h3>
              <p>{daily.category.name}</p>
              <p>{dollarFormat(daily.amount)}</p>
              <p>
                {daily.month}/{daily.day}
              </p>
            </div>
          ))
      ) : (
        <h2>You have no purchases this month.</h2>
      )}
      <NewDailyForm categories={data.categories} />
    </div>
  );
}
