import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteDeduct, fetchDeducts } from '../store';
import { Link } from 'react-router-dom';
import NewYearlyForm from './NewYearlyForm';

export default function EditYearlyExpenses() {
  const income = useSelector((state) => state.auth.income);
  const dispatch = useDispatch();
  const deducts = useSelector((state) => state.yearlyDeductions);
  const { dollarFormat } = useFormatters();

  useEffect(() => {
    dispatch(fetchDeducts());
  }, []);

  const handleDelete = (de) => {
    dispatch(deleteDeduct(de));
  };

  return (
    <div>
      {deducts.map((de) => (
        <div key={de.id}>
          <h3>{de.name}</h3>
          <p>{de.percent ? `${de.percent * 100}% of my earnings` : ''}</p>
          <p>
            {de.percent
              ? dollarFormat(de.percent * income)
              : dollarFormat(de.amount)}
          </p>
          <Link to={`/edit/yearly-expenses/${de.id}`}>
            <button type="button">Edit</button>
          </Link>
          <button type="button" onClick={() => handleDelete(de)}>
            X
          </button>
        </div>
      ))}
      <NewYearlyForm />
    </div>
  );
}
