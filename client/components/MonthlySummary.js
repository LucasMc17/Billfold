import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CatSummary from './CatSummary';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';

const monthTable = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}

export default function MonthlySummary() {
  const { dollarFormat, fixedDec } = useFormatters();
  const data = useData();
  const dispatch = useDispatch();
  const { year, month } = useParams();
  const dailies = data.dailies.filter(
    (ex) => ex.month === Number(month) && ex.year === Number(year)
  );
  const totalSpent = dailies.reduce((acc, daily) => acc + daily.amount, 0);
  return (
    <div>
      <h1>{monthTable[month]}, {year}</h1>
      <h1>OVERVIEW</h1>
      <div>
        <h2>Total</h2>
        <h3>BUDGET PER MONTH: {dollarFormat(data.afterExpenses)}</h3>
        <p>
          AMOUNT SPENT THIS MONTH: {dollarFormat(totalSpent)} /{' '}
          {fixedDec((totalSpent / data.afterExpenses) * 100)}%
        </p>
      </div>
      {data.categories.length ? (
        data.categories.map((cat) => (
          <div key={cat.id}>
            <CatSummary cat={cat} month={month} />
          </div>
        ))
      ) : (
        <h2>You've got no active expense categories! Go make some!</h2>
      )}
      <h1>PURCHASES</h1>
      {dailies.length ? (
        dailies.map((daily) => (
          <div key={daily.id}>
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
    </div>
  );
}
