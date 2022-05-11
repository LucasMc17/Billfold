import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteExpense } from '../store';
import { Link } from 'react-router-dom';
import NewMonthlyForm from './NewMonthlyForm';

export default function EditMonthlyExpenses() {
  const data = useData();
  const { monthlyNet } = data;
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.monthlyExpenses);
  const { dollarFormat } = useFormatters();

  const handleDelete = (ex) => {
    dispatch(deleteExpense(ex));
  };

  return (
    <div>
      <div className="user-items">
        {expenses.map((ex) => (
          <div key={ex.id}>
            <h3>{ex.name}</h3>
            <p>
              {ex.percent
                ? `${ex.percent * 100}% of my monthly net`
                : dollarFormat(ex.amount)}
            </p>
            <Link to={`/edit/monthly-expenses/${ex.id}`}>
              <button type="button">Edit</button>
            </Link>
            <button type="button" onClick={() => handleDelete(ex)}>
              X
            </button>
          </div>
        ))}
      </div>
      <NewMonthlyForm />
    </div>
  );
}
