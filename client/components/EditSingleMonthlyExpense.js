import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchExpense, fetchExpense } from '../store';
import { useParams, useHistory } from 'react-router-dom';

export default function EditSingleMonthlyExpense() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const expense = useSelector((state) => state.singleMonthlyExpense);

  const [ex, setEx] = useState({
    name: '',
    rule: '',
    amount: null,
    percent: null,
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

  const handleChange = (evt) => {
    setEx({
      ...ex,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(patchExpense({ ...ex, percent: ex.percent / 100 }));
    history.push('/edit/monthly-expenses');
  }

  return (
    <div>
      <h1>Edit this Monthly Expense</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={ex.name}
        />
        <label htmlFor="rule">Dollar Amount or Percentage: </label>
        <select name="rule" onChange={handleChange} value={ex.rule}>
          <option value="FIXED">Dollar Amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
        {ex.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={ex.amount}
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
              value={ex.percent}
            />
          </div>
        )}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
