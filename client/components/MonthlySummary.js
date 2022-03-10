import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CatSummary from './CatSummary';
import useData from './custom_hooks/useData';

export default function MonthlySummary() {
  const data = useData();
  const dispatch = useDispatch();
  const { year, month } = useParams();
  const dailies = data.dailies.filter(
    (ex) => ex.month === Number(month) && ex.year === Number(year)
  );
  return (
    <div>
      <h1>OVERVIEW</h1>
      {data.categories.map((cat) => (
        <div key={cat.id}>
          <CatSummary cat={cat} month={month} />
        </div>
      ))}
      <h1>PURCHASES</h1>
      {dailies.map((daily) => (
        <div key={daily.id}>
          <h3>{daily.name}</h3>
          <p>{daily.category.name}</p>
          <p>${daily.amount}</p>
          <p>
            {daily.month}/{daily.day}
          </p>
        </div>
      ))}
    </div>
  );
}
