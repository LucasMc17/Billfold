import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableCategories, postDaily } from '../store';
import useFormatters from './custom_hooks/useFormatters';
const { seperateActive } = useFormatters();

export default function NewDailyForm(props) {
  const allCategories = useSelector((state) => state.allCategories);
  const [categories, setCategories] = useState(
    seperateActive(allCategories)[0]
  );
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
  }

  useEffect(() => {
    if (daily.date) {
      const date = new Date(daily.date);
      setCategories(seperateActive(allCategories, date)[0]);
    }
  }, [daily.date]);

  useEffect(() => {
    if (!categories.some((cat) => cat.name === daily.category)) {
      setDaily({
        ...daily,
        category: categories.length ? categories[0].name : '',
      });
    }
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
        <select name="category" onChange={handleChange} value={daily.category}>
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
