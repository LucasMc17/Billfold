import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteDeduct, fetchAllDeducts } from '../store';
import { Link } from 'react-router-dom';
import NewYearlyForm from './NewYearlyForm';
import getInsightGrabber from './custom_hooks/getInsights';
import { setInsights } from '../store';

export default function EditYearlyExpenses() {
  const dispatch = useDispatch();
  const getInsights = getInsightGrabber();
  const deducts = useSelector((state) => state.allDeducts);
  const { dollarFormat, seperateActive } = useFormatters();

  const handleDelete = (de) => {
    dispatch(deleteDeduct(de));
  };

  const [active, inactive] = seperateActive(deducts);

  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, [active.length, inactive.length]);

  return (
    <div>
      <NewYearlyForm />
      {active.length ? (
        <>
          <h1>My Active Yearly Expenses:</h1>
          <div className="user-items">
            {active.map((de) => (
              <div key={de.id}>
                <h3>{de.name}</h3>
                <p>
                  {de.percent
                    ? `${de.percent * 100}% of my earnings`
                    : dollarFormat(de.amount)}
                </p>
                <Link to={`/edit/yearly-expenses/${de.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {de.startMonth}/{de.startYear}
                  {de.endMonth ? ` - ${de.endMonth}/${de.endYear}` : ' onward'}
                </p>
                <Link to={`/edit/yearly-expenses/dates/${de.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(de)}>
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
          <h1>My Inactive Yearly Expenses:</h1>
          <div className="user-items">
            {inactive.map((de) => (
              <div key={de.id} style={{ backgroundColor: 'gray' }}>
                <h3>{de.name}</h3>
                <p>
                  {de.percent
                    ? `${de.percent * 100}% of my earnings`
                    : dollarFormat(de.amount)}
                </p>
                <Link to={`/edit/yearly-expenses/${de.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {de.startMonth}/{de.startYear}
                  {de.endMonth ? ` - ${de.endMonth}/${de.endYear}` : ' onward'}
                </p>
                <Link to={`/edit/yearly-expenses/dates/${de.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(de)}>
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
