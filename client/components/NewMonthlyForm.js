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
  });

  const handleChange = (evt) => {
    setExpense({
      ...expense,
      [evt.target.name]: evt.target.value,
    });
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
        <button type="submit">Finish</button>
      </form>
    </div>
  );
}
