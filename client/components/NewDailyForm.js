import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableCategories, postDaily } from '../store';

export default function NewDailyForm(props) {
  const categories = useSelector((state) => state.availableCategories);
  const dispatch = useDispatch();
  const { defaultDate } = props;
  const [daily, setDaily] = useState({
    name: '',
    date: defaultDate ? defaultDate : new Date().toISOString().split('T')[0],
    amount: 0,
    category: categories.length ? categories[0].name : '',
  });

  const handleChange = (evt) => {
    setDaily({
      ...daily,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(postDaily(daily));
    console.log(daily);
  }

  useEffect(() => {
    if (daily.date) {
      const date = new Date(daily.date);
      dispatch(fetchAvailableCategories(date.getFullYear(), date.getMonth()));
    }
  }, [daily.date]);

  useEffect(() => {
    setDaily({
      ...daily,
      category: categories.length ? categories[0].name : '',
    });
  }, [categories]);

  return (
    <div className="form add-daily-form">
      <h1>Log a New Purchase</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Description: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={daily.name}
        />
        <label htmlFor="amount">Amount: </label>
        <input
          name="amount"
          onChange={handleChange}
          type="number"
          value={daily.amount}
        />
        <label htmlFor="date">Date: </label>
        <input
          name="date"
          onChange={handleChange}
          type="date"
          value={daily.date}
        />
        <label htmlFor="category">Category: </label>
        <select name="category" onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
