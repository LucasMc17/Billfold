import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postDeduct } from '../store';

export default function NewYearlyForm(props) {
  const dispatch = useDispatch();
  // const { categories } = props;
  const [deduct, setDeduct] = useState({
    name: '',
    rule: 'FIXED',
    amount: null,
    percent: null,
  });

  const handleChange = (evt) => {
    setDeduct({
      ...deduct,
      [evt.target.name]: evt.target.value,
    });
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
        <button type="submit">Finish</button>
      </form>
    </div>
  );
}
