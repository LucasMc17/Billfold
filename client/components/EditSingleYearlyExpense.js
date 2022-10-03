import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchDeduct, fetchDeduct } from '../store';
import { useParams, useHistory } from 'react-router-dom';

export default function EditSingleYearlyExpense() {
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={de.name}
        />
        <label htmlFor="rule">Dollar Amount or Percentage: </label>
        <select name="rule" onChange={handleChange} value={de.rule}>
          <option value="FIXED">Dollar Amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
        {de.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${de.amount}`}
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
              value={`${de.percent}`}
            />
          </div>
        )}
        <p>
          {de.startMonth}/{de.startYear}
          {de.endMonth ? ` to ${de.endMonth}/${de.endYear}` : ' onward'}
        </p>
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
        <button type="submit" disabled={error}>
          Save Changes
        </button>
        <p>
          {de.changeDate.getMonth() + 1 === de.startMonth &&
          de.changeDate.getFullYear() === de.startYear
            ? 'WARNING: This will overwrite the expense'
            : ''}
        </p>
      </form>
    </div>
  );
}
