import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchCategory, fetchCategory } from '../store';
import { useParams, useHistory } from 'react-router-dom';

export default function EditSingleCategory() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const category = useSelector((state) => state.singleCategory);

  const [cat, setCat] = useState({
    name: '',
    rule: '',
    amount: null,
    percent: null,
  });

  useEffect(() => {
    dispatch(fetchCategory(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(category);
    if (keys.length > 0) {
      setCat({ ...category, percent: category.percent * 100 });
    }
  }, [category]);

  const handleChange = (evt) => {
    setCat({
      ...cat,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchCategory({
        ...cat,
        percent: Number(cat.percent) / 100,
        amount: Number(cat.amount),
      })
    );
    cat.rule === 'FIXED'
      ? history.push(`/edit/fixed-categories`)
      : history.push(`/edit/flexible-categories`);
  }

  return (
    <div>
      <h1>Edit this Category</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={cat.name}
        />
        <label htmlFor="rule">Dollar Amount or Percentage: </label>
        <select name="rule" onChange={handleChange} value={cat.rule}>
          <option value="FIXED">Dollar Amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
        {cat.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${cat.amount}`}
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
              value={`${cat.percent}`}
            />
          </div>
        )}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
