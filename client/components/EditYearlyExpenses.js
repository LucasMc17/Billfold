import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteDeduct, fetchDeducts } from '../store';

export default function EditYearlyExpenses() {
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
          <button type="button" onClick={() => handleDelete(de)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}
