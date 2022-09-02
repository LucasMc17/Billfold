import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchDeduct, fetchDeduct, fetchDeducts } from '../store';
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
  });

  useEffect(() => {
    dispatch(fetchDeduct(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(deduct);
    if (keys.length > 0) {
      setDe({ ...deduct, percent: deduct.percent * 100 });
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
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    dispatch(fetchDeducts(year, month));
    history.push('/edit/yearly-expenses');
  }

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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
