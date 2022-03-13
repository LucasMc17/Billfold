import React from 'react';
import { useDispatch } from 'react-redux';
import useFormatters from './custom_hooks/useFormatters';
import { deleteDaily } from '../store';
import { Link } from 'react-router-dom';

export default function DailyExpense(props) {
  const { daily } = props;
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();

  function handleDelete(daily) {
    dispatch(deleteDaily(daily));
  }

  return (
    <div className="daily" key={daily.id}>
      <h3 className="dailyCat">{daily.category.name}</h3>
      <div className="dailyContents">
        <h3 className="dailyName">{daily.name}</h3>
        <p className="dailyAmount">{dollarFormat(daily.amount)}</p>
        <p className="dailyDate">
          {daily.month}/{daily.day}
        </p>
      </div>
      <button className="del" onClick={() => handleDelete(daily)}>
        X
      </button>
      <Link to={`/edit/daily-expenses/${daily.id}`}>
        <button className="edit">Edit</button>
      </Link>
    </div>
  );
}
