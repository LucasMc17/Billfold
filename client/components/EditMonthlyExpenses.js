import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteExpense, fetchAllExpenses } from '../store';
import { Link } from 'react-router-dom';
import NewMonthlyForm from './NewMonthlyForm';
import getInsightGrabber from './custom_hooks/getInsights';
import { setInsights } from '../store';

export default function EditMonthlyExpenses() {
  const data = useData();
  const getInsights = getInsightGrabber();
  const { monthlyNet } = data;
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.allExpenses);
  const { dollarFormat, seperateActive } = useFormatters();

  const handleDelete = (ex) => {
    dispatch(deleteExpense(ex));
  };

  const [active, inactive] = seperateActive(expenses);

  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, [active.length, inactive.length]);

  return (
    <div>
      <NewMonthlyForm />
      {active.length ? (
        <>
          <h1>My Active Monthly Expenses:</h1>
          <div className="user-items">
            {active.map((ex) => (
              <div key={ex.id}>
                <h3>{ex.name}</h3>
                <p>
                  {ex.percent
                    ? `${ex.percent * 100}% of my monthly net`
                    : dollarFormat(ex.amount)}
                </p>
                <Link to={`/edit/monthly-expenses/${ex.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {ex.startMonth}/{ex.startYear}
                  {ex.endMonth ? ` - ${ex.endMonth}/${ex.endYear}` : ' onward'}
                </p>
                <Link to={`/edit/monthly-expenses/dates/${ex.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(ex)}>
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
          <h1>My Inactive Monthly Expenses:</h1>
          <div className="user-items">
            {inactive.map((ex) => (
              <div key={ex.id} style={{ backgroundColor: 'gray' }}>
                <h3>{ex.name}</h3>
                <p>
                  {ex.percent
                    ? `${ex.percent * 100}% of my monthly net`
                    : dollarFormat(ex.amount)}
                </p>
                <Link to={`/edit/monthly-expenses/${ex.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {ex.startMonth}/{ex.startYear}
                  {ex.endMonth ? ` - ${ex.endMonth}/${ex.endYear}` : ' onward'}
                </p>
                <Link to={`/edit/monthly-expenses/dates/${ex.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(ex)}>
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
