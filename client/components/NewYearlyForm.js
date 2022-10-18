import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postDeduct } from '../store';

export default function NewYearlyForm(props) {
  const dispatch = useDispatch();
  const [deduct, setDeduct] = useState({
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
      setDeduct({
        ...deduct,
        [evt.target.name]: evt.target.value,
      });
    } else if (evt.target.name === 'start') {
      setDeduct({
        ...deduct,
        startYear: Number(evt.target.value.split('-')[0]),
        startMonth: Number(evt.target.value.split('-')[1]),
      });
    } else {
      if (evt.target.value) {
        setDeduct({
          ...deduct,
          endYear: Number(evt.target.value.split('-')[0]),
          endMonth: Number(evt.target.value.split('-')[1]),
        });
      } else {
        setDeduct({
          ...deduct,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      postDeduct({
        ...deduct,
        percent: Number(deduct.percent) / 100,
        amount: Number(deduct.amount),
      })
    );
  }

  return (
    <div className="form add-yearly-form">
      <h1>Add a New Yearly Expense</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Description: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={deduct.name}
        />
        <label htmlFor="rule">Dollar Amount or Percentage: </label>
        <select name="rule" onChange={handleChange} value={deduct.rule}>
          <option value="FIXED">Dollar Amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
        {deduct.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${deduct.amount}`}
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
              value={`${deduct.percent}`}
            />
          </div>
        )}
        <p>
          This expense begins/began at the start of{' '}
          <input
            name="start"
            type="month"
            value={`${deduct.startYear}-${String(deduct.startMonth).padStart(
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
              deduct.endYear
                ? `${deduct.endYear}-${String(deduct.endMonth).padStart(
                    2,
                    '0'
                  )}`
                : ''
            }
            onChange={handleChange}
          />{' '}
          (leave blank if ongoing)
        </p>
        <button type="submit">Finish</button>
      </form>
    </div>
  );
}
