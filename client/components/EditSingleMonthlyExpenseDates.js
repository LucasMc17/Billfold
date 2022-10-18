import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchExpense, fetchExpense } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpenseDates() {
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const expense = useSelector((state) => state.singleMonthlyExpense);

  const [ex, setEx] = useState({
    name: '',
    rule: '',
    amount: null,
    percent: null,
    startMonth: 1,
    startYear: 2000,
    endMonth: 1,
    endYear: 3000,
  });

  useEffect(() => {
    dispatch(fetchExpense(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(expense);
    if (keys.length > 0) {
      setEx({ ...expense, percent: expense.percent * 100 });
    }
  }, [expense]);

  const error =
    !ex.startYear ||
    (ex.endYear &&
      ((ex.startYear === ex.endYear && ex.startMonth >= ex.endMonth) ||
        ex.endYear < ex.startYear));

  const handleChange = (evt) => {
    const { value, name } = evt.target;
    console.log(ex);
    if (name === 'start') {
      if (value) {
        setEx({
          ...ex,
          startYear: Number(value.split('-')[0]),
          startMonth: Number(value.split('-')[1]),
        });
      } else {
        setEx({
          ...ex,
          startYear: null,
          startMonth: null,
        });
      }
    } else {
      if (value) {
        setEx({
          ...ex,
          endYear: Number(value.split('-')[0]),
          endMonth: Number(value.split('-')[1]),
        });
      } else {
        setEx({
          ...ex,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchExpense({
        ...ex,
        percent: Number(ex.percent) / 100,
        amount: Number(ex.amount),
      })
    );
    history.push('/edit/monthly-expenses');
  }
  return (
    <div>
      <h1>Edit this Monthly Expense</h1>
      <h2>{ex.name}</h2>
      <h2>{ex.amount ? dollarFormat(ex.amount) : `${ex.percent}%`}</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Active from the start of{' '}
          <input
            type="month"
            name="start"
            value={`${ex.startYear}-${String(ex.startMonth).padStart(2, '0')}`}
            onChange={handleChange}
          ></input>
        </p>
        <p>
          Active until the start of{' '}
          <input
            type="month"
            value={
              ex.endYear
                ? `${ex.endYear}-${String(ex.endMonth).padStart(2, '0')}`
                : ''
            }
            onChange={handleChange}
          ></input>{' '}
          (leave blank if ongoing)
        </p>
        <button disabled={error} type="submit">
          Save Changes
        </button>
      </form>
      <h1>{error ? 'NO WAY JOSE' : ''}</h1>
    </div>
  );
}
