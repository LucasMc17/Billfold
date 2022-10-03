import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteDeduct } from '../store';
import { Link } from 'react-router-dom';
import NewYearlyForm from './NewYearlyForm';

export default function EditYearlyExpenses() {
  const dispatch = useDispatch();
  const deducts = useSelector((state) => state.yearlyDeductions);
  const { dollarFormat } = useFormatters();

  const handleDelete = (de) => {
    dispatch(deleteDeduct(de));
  };

  return (
    <div>
      <div className="user-items">
        <h1>My Yearly Expenses:</h1>
        {deducts.map((de) => (
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
      <NewYearlyForm />
    </div>
  );
}
