import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postExpense } from '../store';

export default function NewMonthlyForm(props) {
  const dispatch = useDispatch();
  const [expense, setExpense] = useState({
    name: '',
    rule: 'FIXED',
    amount: null,
    percent: null,
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: null,
    endYear: null,
  });

  const handleChange = (evt) => {
    if (evt.target.name !== 'start' && evt.target.name !== 'end') {
      setExpense({
        ...expense,
        [evt.target.name]: evt.target.value,
      });
    } else if (evt.target.name === 'start') {
      setExpense({
        ...expense,
        startYear: Number(evt.target.value.split('-')[0]),
        startMonth: Number(evt.target.value.split('-')[1]),
      });
    } else {
      if (evt.target.value) {
        setExpense({
          ...expense,
          endYear: Number(evt.target.value.split('-')[0]),
          endMonth: Number(evt.target.value.split('-')[1]),
        });
      } else {
        setExpense({
          ...expense,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      postExpense({
        ...expense,
        percent: Number(expense.percent) / 100,
        amount: Number(expense.amount),
      })
    );
  }

  const error =
    !expense.startYear ||
    (expense.endYear &&
      ((expense.startYear === expense.endYear &&
        expense.startMonth >= expense.endMonth) ||
        expense.endYear < expense.startYear));

  return (
    <div className="form add-monthly-form">
      <h1>Add a New Monthly Expense</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Description: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={expense.name}
        />
        <label htmlFor="rule">Dollar Amount or Percentage: </label>
        <select name="rule" onChange={handleChange} value={expense.rule}>
          <option value="FIXED">Dollar Amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
        {expense.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${expense.amount}`}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="percent">Percentage: </label>
            <input
              name="percent"
              max="100"
              min="1"
              onChange={handleChange}
              type="number"
              value={`${expense.percent}`}
            />
          </div>
        )}
        <p>
          This expense begins/began at the start of{' '}
          <input
            name="start"
            type="month"
            value={`${expense.startYear}-${String(expense.startMonth).padStart(
              2,
              '0'
            )}`}
            onChange={handleChange}
          />{' '}
          and ends/ended at the start of{' '}
          <input
            name="end"
            type="month"
            value={
              expense.endYear
                ? `${expense.endYear}-${String(expense.endMonth).padStart(
                    2,
                    '0'
                  )}`
                : ''
            }
            onChange={handleChange}
          />{' '}
          (leave blank if ongoing)
        </p>
        <button type="submit" disabled={error}>
          Finish
        </button>
      </form>
    </div>
  );
}
