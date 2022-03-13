import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postCategory } from '../store';

export default function NewCategoryForm(props) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState({
    name: '',
    rule: 'FIXED',
    amount: null,
    percent: null,
  });

  const handleChange = (evt) => {
    setCategory({
      ...category,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      postCategory({
        ...category,
        percent: Number(category.percent) / 100,
        amount: Number(category.amount),
      })
    );
  }

  return (
    <div className="form add-category-form">
      <h1>Add a New Category</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Description: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={category.name}
        />
        <label htmlFor="rule">Dollar Amount or Percentage: </label>
        <select name="rule" onChange={handleChange} value={category.rule}>
          <option value="FIXED">Dollar Amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
        {category.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${category.amount}`}
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
              value={`${category.percent}`}
            />
          </div>
        )}
        <button type="submit">Finish</button>
      </form>
    </div>
  );
}
