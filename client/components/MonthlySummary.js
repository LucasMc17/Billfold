import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CatSummary from './CatSummary';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';

export default function MonthlySummary() {
  const { dollarFormat } = useFormatters();
  const data = useData();
  const dispatch = useDispatch();
  const { year, month } = useParams();
  const dailies = data.dailies.filter(
    (ex) => ex.month === Number(month) && ex.year === Number(year)
  );
  return (
    <div>
      <h1>OVERVIEW</h1>
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
