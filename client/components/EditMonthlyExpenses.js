import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteExpense, fetchExpenses } from '../store';

export default function EditMonthlyExpenses() {
  const income = useSelector(state => state.auth.income)
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.monthlyExpenses);
  const { dollarFormat } = useFormatters();

  useEffect(() => {
    dispatch(fetchExpenses());
  }, []);

  const handleDelete = (ex) => {
    dispatch(deleteExpense(ex))
  }

  return (
    <div>
      {expenses.map((ex) => (
        <div key={ex.id}>
          <h3>{ex.name}</h3>
          <p>{ex.percent ? `${ex.percent * 100}% of my monthly net` : ''}</p>
          <p>
            {ex.percent
              ? dollarFormat(ex.percent * income)
              : dollarFormat(ex.amount)}
          </p>
          <button type="button" onClick={() => handleDelete(ex)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}
