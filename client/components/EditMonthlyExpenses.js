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
  const tut = useSelector((state) => state.showTutorial);
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
      {active.length || tut ? (
        <>
          <h1>My Active Monthly Expenses:</h1>
          <div className="user-items">
            {tut ? (
              <>
                <div>
                  <h3>Savings</h3>
                  <p>25% of my monthly net</p>
                  <Link to={`/edit/monthly-expenses/`}>
                    <button type="button">Edit Details</button>
                  </Link>
                  <p>1/2021 onward</p>
                  <Link to={`/edit/monthly-expenses/`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button">X</button>
                </div>
                <div>
                  <h3>Rent</h3>
                  <p>$900.00</p>
                  <Link to={`/edit/monthly-expenses/`}>
                    <button type="button">Edit Details</button>
                  </Link>
                  <p>1/2021 onward</p>
                  <Link to={`/edit/monthly-expenses/`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button">X</button>
                </div>
                <div>
                  <h3>Movie streaming</h3>
                  <p>$15.00</p>
                  <Link to={`/edit/monthly-expenses/`}>
                    <button type="button">Edit Details</button>
                  </Link>
                  <p>3/2021 onward</p>
                  <Link to={`/edit/monthly-expenses/`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button">X</button>
                </div>
              </>
            ) : (
              active.map((ex) => (
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
                    {ex.endMonth
                      ? ` - ${ex.endMonth}/${ex.endYear}`
                      : ' onward'}
                  </p>
                  <Link to={`/edit/monthly-expenses/dates/${ex.id}`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button" onClick={() => handleDelete(ex)}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      {inactive.length || tut ? (
        <>
          <h1>My Inactive Monthly Expenses:</h1>
          <div className="user-items">
            {tut ? (
              <>
                <div style={{ backgroundColor: 'gray' }}>
                  <h3>Gym membership</h3>
                  <p>$30.00</p>
                  <Link to={`/edit/monthly-expenses`}>
                    <button type="button">Edit Details</button>
                  </Link>
                  <p>1/2021 - 5/2022</p>
                  <Link to={`/edit/monthly-expenses`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button">X</button>
                </div>
                <div style={{ backgroundColor: 'gray' }}>
                  <h3>Movie streaming</h3>
                  <p>$10.00</p>
                  <Link to={`/edit/monthly-expenses`}>
                    <button type="button">Edit Details</button>
                  </Link>
                  <p>1/2021 - 3/2021</p>
                  <Link to={`/edit/monthly-expenses`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button">X</button>
                </div>
              </>
            ) : (
              inactive.map((ex) => (
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
                    {ex.endMonth
                      ? ` - ${ex.endMonth}/${ex.endYear}`
                      : ' onward'}
                  </p>
                  <Link to={`/edit/monthly-expenses/dates/${ex.id}`}>
                    <button type="button">Edit Date Range</button>
                  </Link>
                  <button type="button" onClick={() => handleDelete(ex)}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
