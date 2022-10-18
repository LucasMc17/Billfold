import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchExpense, fetchExpense } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpense() {
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
    changeDate: new Date(),
  });

  useEffect(() => {
    dispatch(fetchExpense(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(expense);
    if (keys.length > 0) {
      setEx({
        ...expense,
        percent: expense.percent * 100,
        changeDate: new Date(new Date().getFullYear(), new Date().getMonth()),
      });
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
    dispatch(
      patchExpense({
        ...ex,
        percent: Number(ex.percent) / 100,
        amount: Number(ex.amount),
      })
    );
    history.push('/edit/monthly-expenses');
  }

  function handleDateChange(evt) {
    const { value } = evt.target;
    setEx((prevDate) => ({
      ...prevDate,
      changeDate: new Date(
        Number(value.split('-')[0]),
        Number(value.split('-')[1]) - 1,
        1
      ),
    }));
  }

  const error = ex.changeDate < new Date(ex.startYear, ex.startMonth - 1);

  return (
    <div>
      <h1>Edit this Monthly Expense</h1>
      <div id="edit-form">
        <div className="edit-card">
          <p className="edit-card-header">Current expense</p>
          <div className="edit-card-field">
            <p>{expense.name}</p>
          </div>
          <div className="edit-card-field">
            <p>
              {expense.amount
                ? dollarFormat(expense.amount)
                : `${expense.percent * 100}%`}
            </p>
          </div>
          <div className="edit-card-field">
            <p>
              {expense.startMonth}/{expense.startYear}
              {expense.endMonth
                ? ` to ${expense.endMonth}/${expense.endYear}`
                : ' onward'}
            </p>
          </div>
        </div>
        <h1>{'>'}</h1>
        <form onSubmit={handleSubmit} className="edit-card">
          <p className="edit-card-header">Expense after edits</p>
          <div className="edit-card-field">
            <input
              name="name"
              onChange={handleChange}
              type="text"
              value={ex.name}
            />
          </div>
          <div className="edit-card-field edit-card-rule">
            {ex.rule === 'FIXED' ? (
              <input
                name="amount"
                onChange={handleChange}
                type="number"
                value={`${ex.amount}`}
              />
            ) : (
              <input
                name="percent"
                max="100"
                min="1"
                onChange={handleChange}
                type="number"
                value={`${ex.percent}`}
              />
            )}
            <select name="rule" onChange={handleChange} value={ex.rule}>
              <option value="FIXED">dollars</option>
              <option value="PERCENT">percent</option>
            </select>
          </div>
          <div className="edit-card-field">
            <p>
              This change would be effective from the start of{' '}
              <input
                type="month"
                onChange={handleDateChange}
                value={`${ex.changeDate.getFullYear()}-${String(
                  ex.changeDate.getMonth() + 1
                ).padStart(2, '0')}`}
              />
              {ex.endYear
                ? ` until the start of ${ex.endMonth}/${ex.endYear}`
                : ' onward'}
            </p>
          </div>
          <button type="submit" disabled={error}>
            Save Changes
          </button>
        </form>
      </div>
      <p>
        {ex.changeDate.getMonth() + 1 === ex.startMonth &&
        ex.changeDate.getFullYear() === ex.startYear
          ? 'WARNING: This will overwrite the expense'
          : ''}
      </p>
      <p>
        {error ? 'Cannot edit an expense from before it went into effect!' : ''}
      </p>
    </div>
  );
}
