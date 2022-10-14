import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchDeduct, fetchDeduct } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpense() {
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const deduct = useSelector((state) => state.singleYearlyDeduction);

  const [de, setDe] = useState({
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
    dispatch(fetchDeduct(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(deduct);
    if (keys.length > 0) {
      setDe({
        ...deduct,
        percent: deduct.percent * 100,
        changeDate: new Date(new Date().getFullYear(), new Date().getMonth()),
      });
    }
  }, [deduct]);

  const handleChange = (evt) => {
    setDe({
      ...de,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchDeduct({
        ...de,
        percent: Number(de.percent) / 100,
        amount: Number(de.amount),
      })
    );
    history.push('/edit/yearly-expenses');
  }

  function handleDateChange(evt) {
    const { value } = evt.target;
    setDe((prevDate) => ({
      ...prevDate,
      changeDate: new Date(
        Number(value.split('-')[0]),
        Number(value.split('-')[1]) - 1,
        1
      ),
    }));
  }

  const error = de.changeDate < new Date(de.startYear, de.startMonth - 1);

  console.log(new Date(de.startYear, de.startMonth - 1));
  console.log(de.changeDate);

  return (
    <div>
      <h1>Edit this Yearly Expense</h1>
      <div id="edit-form">
        <div className="edit-card">
          <p className="edit-card-header">Current expense</p>
          <div className="edit-card-field">
            <p>{deduct.name}</p>
          </div>
          <div className="edit-card-field">
            <p>
              {deduct.amount
                ? dollarFormat(deduct.amount)
                : `${deduct.percent * 100}%`}
            </p>
          </div>
          <div className="edit-card-field">
            <p>
              {deduct.startMonth}/{deduct.startYear}
              {deduct.endMonth
                ? ` to ${deduct.endMonth}/${deduct.endYear}`
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
              value={de.name}
            />
          </div>
          <div className="edit-card-field edit-card-rule">
            {de.rule === 'FIXED' ? (
              <input
                name="amount"
                onChange={handleChange}
                type="number"
                value={`${de.amount}`}
              />
            ) : (
              <input
                name="percent"
                max="100"
                min="1"
                onChange={handleChange}
                type="number"
                value={`${de.percent}`}
              />
            )}
            <select name="rule" onChange={handleChange} value={de.rule}>
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
                value={`${de.changeDate.getFullYear()}-${String(
                  de.changeDate.getMonth() + 1
                ).padStart(2, '0')}`}
              />
              {de.endYear
                ? ` until the start of ${de.endMonth}/${de.endYear}`
                : ' onward'}
            </p>
          </div>
          <button type="submit" disabled={error}>
            Save Changes
          </button>
        </form>
      </div>
      <p>
        {de.changeDate.getMonth() + 1 === de.startMonth &&
        de.changeDate.getFullYear() === de.startYear
          ? 'WARNING: This will overwrite the expense'
          : ''}
      </p>
      <p>
        {error ? 'Cannot edit an expense from before it went into effect!' : ''}
      </p>
    </div>
  );
}
