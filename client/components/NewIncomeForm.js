import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postIncome } from '../store';

export default function NewIncomeForm(props) {
  const dispatch = useDispatch();
  const [income, setIncome] = useState({
    amount: null,
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: null,
    endYear: null,
  });

  const handleChange = (evt) => {
    if (evt.target.name !== 'start' && evt.target.name !== 'end') {
      setIncome({
        ...income,
        [evt.target.name]: evt.target.value,
      });
    } else if (evt.target.name === 'start') {
      setIncome({
        ...income,
        startYear: Number(evt.target.value.split('-')[0]),
        startMonth: Number(evt.target.value.split('-')[1]),
      });
    } else {
      if (evt.target.value) {
        setIncome({
          ...income,
          endYear: Number(evt.target.value.split('-')[0]),
          endMonth: Number(evt.target.value.split('-')[1]),
        });
      } else {
        setIncome({
          ...income,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      postIncome({
        ...income,
        amount: Number(income.amount),
      })
    );
  }

  const error =
    !income.startYear ||
    (income.endYear &&
      ((income.startYear === income.endYear &&
        income.startMonth >= income.endMonth) ||
        income.endYear < income.startYear));

  return (
    <div className="form add-income-form">
      <h1>Add a New Income</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount: </label>
          <input
            name="amount"
            onChange={handleChange}
            type="number"
            value={`${income.amount}`}
          />
        </div>
        <p>
          This income begins/began at the start of{' '}
          <input
            name="start"
            type="month"
            value={`${income.startYear}-${String(income.startMonth).padStart(
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
              income.endYear
                ? `${income.endYear}-${String(income.endMonth).padStart(
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
