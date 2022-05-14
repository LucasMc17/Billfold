import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteDeduct, fetchDeducts, postBudget } from '../store';
import { Link } from 'react-router-dom';
import NewYearlyForm from './NewYearlyForm';

export default function EditYearlyExpenses() {
  const yearlies = useSelector((state) =>
    JSON.parse(state.currentBudget.yearlies)
  );
  const income = useSelector((state) => state.auth.income);
  const dispatch = useDispatch();
  const deducts = useSelector((state) => state.yearlyDeductions);
  const { dollarFormat } = useFormatters();

  const handleDelete = (de) => {
    const vettedDeductions = yearlies.filter((deduct) => {
      if (
        deduct.name === de.name && deduct.rule === de.rule && deduct.amount
          ? deduct.amount === de.amount
          : deduct.percent === de.percent
      ) {
        return false;
      } else {
        return true;
      }
    });
    dispatch(postBudget({ yearlies: JSON.stringify(vettedDeductions) }));
    dispatch(deleteDeduct(de));
  };

  return (
    <div>
      <div className="user-items">
        {deducts.map((de, i) => (
          <div key={de.id}>
            <h1>{i + 1}</h1>
            <h3>{de.name}</h3>
            <p>
              {de.percent
                ? `${de.percent * 100}% of my earnings`
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
      </div>
      <NewYearlyForm />
    </div>
  );
}
