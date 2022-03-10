import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function MonthlySummary() {
  const dispatch = useDispatch();
  const { year, month } = useParams();
  const dailies = useSelector((state) =>
    state.dailyExpenses.filter(
      (ex) => ex.month === Number(month) && ex.year === Number(year)
    )
  );
  return (
    <div>
      {dailies.map((daily) => (
        <div key={daily.id}>{daily.name}</div>
      ))}
    </div>
  );
}
