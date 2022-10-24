import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchIncome, fetchSingleIncome } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpense() {
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const income = useSelector((state) => state.singleIncome);

  const [inc, setInc] = useState({
    amount: null,
    startMonth: 1,
    startYear: 2000,
    endMonth: 1,
    endYear: 3000,
    changeDate: new Date(),
  });

  useEffect(() => {
    dispatch(fetchSingleIncome(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(income);
    if (keys.length > 0) {
      setInc({
        ...income,
        changeDate: new Date(new Date().getFullYear(), new Date().getMonth()),
      });
    }
  }, [income]);

  const handleChange = (evt) => {
    setInc({
      ...inc,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchIncome({
        ...inc,
        amount: Number(inc.amount),
      })
    );
    history.push('/edit/incomes');
  }

  function handleDateChange(evt) {
    const { value } = evt.target;
    setInc((prevDate) => ({
      ...prevDate,
      changeDate: new Date(
        Number(value.split('-')[0]),
        Number(value.split('-')[1]) - 1,
        1
      ),
    }));
  }

  const error = inc.changeDate < new Date(inc.startYear, inc.startMonth - 1);

  return (
    <div>
      <h1>Edit this Income</h1>
      <div id="edit-form">
        <div className="edit-card">
          <p className="edit-card-header">Current income</p>
          <div className="edit-card-field">
            <p>{income.amount}</p>
          </div>
          <div className="edit-card-field">
            <p>
              {income.startMonth}/{income.startYear}
              {income.endMonth
                ? ` to ${income.endMonth}/${income.endYear}`
                : ' onward'}
            </p>
          </div>
        </div>
        <h1>{'>'}</h1>
        <form onSubmit={handleSubmit} className="edit-card">
          <p className="edit-card-header">Income after edits</p>
          <div className="edit-card-field edit-card-rule">
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${inc.amount}`}
            />
          </div>
          <div className="edit-card-field">
            <p>
              This change would be effective from the start of{' '}
              <input
                type="month"
                onChange={handleDateChange}
                value={`${inc.changeDate.getFullYear()}-${String(
                  inc.changeDate.getMonth() + 1
                ).padStart(2, '0')}`}
              />
              {inc.endYear
                ? ` until the start of ${inc.endMonth}/${inc.endYear}`
                : ' onward'}
            </p>
          </div>
          <button type="submit" disabled={error}>
            Save Changes
          </button>
        </form>
      </div>
      <p>
        {inc.changeDate.getMonth() + 1 === inc.startMonth &&
        inc.changeDate.getFullYear() === inc.startYear
          ? 'WARNING: This will overwrite the income'
          : ''}
      </p>
      <p>
        {error ? 'Cannot edit an income from before it went into effect!' : ''}
      </p>
    </div>
  );
}
