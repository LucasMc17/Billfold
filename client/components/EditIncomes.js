import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteIncome, fetchAllIncomes } from '../store';
import { Link } from 'react-router-dom';
import NewIncomeForm from './NewIncomeForm';
import getInsightGrabber from './custom_hooks/getInsights';
import { setInsights } from '../store';

export default function EditIncomes() {
  const dispatch = useDispatch();
  const getInsights = getInsightGrabber();
  const incomes = useSelector((state) => state.allIncomes);
  const { dollarFormat, seperateActive } = useFormatters();

  const handleDelete = (inc) => {
    dispatch(deleteIncome(inc));
  };

  const [active, inactive] = seperateActive(incomes);

  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, [active.length, inactive.length]);

  return (
    <div>
      <NewIncomeForm />
      {active.length ? (
        <>
          <h1>My Active Incomes:</h1>
          <div className="user-items">
            {active.map((inc) => (
              <div key={inc.id}>
                <h3>{dollarFormat(inc.amount)}</h3>
                <Link to={`/edit/incomes/${inc.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {inc.startMonth}/{inc.startYear}
                  {inc.endMonth
                    ? ` - ${inc.endMonth}/${inc.endYear}`
                    : ' onward'}
                </p>
                <Link to={`/edit/incomes/dates/${inc.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(inc)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {inactive.length ? (
        <>
          <h1>My Inactive Incomes:</h1>
          <div className="user-items">
            {inactive.map((inc) => (
              <div key={inc.id} style={{ backgroundColor: 'gray' }}>
                <h3>{dollarFormat(inc.amount)}</h3>
                <Link to={`/edit/incomes/${inc.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {inc.startMonth}/{inc.startYear}
                  {inc.endMonth
                    ? ` - ${inc.endMonth}/${inc.endYear}`
                    : ' onward'}
                </p>
                <Link to={`/edit/incomes/dates/${inc.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(inc)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
