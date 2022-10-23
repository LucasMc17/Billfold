import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchDaily, fetchDaily } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';
const { seperateActive } = useFormatters();

export default function EditDailyExpense() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const dailyExpense = useSelector((state) => state.singleDailyExpense);
  const allCategories = useSelector((state) => state.allCategories);
  const [categories, setCategories] = useState(
    seperateActive(allCategories)[0]
  );

  const [daily, setDaily] = useState({
    name: '',
    amount: 0,
    categoryId: 0,
    date: new Date(),
  });

  useEffect(() => {
    dispatch(fetchDaily(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(dailyExpense);
    if (keys.length > 0) {
      setDaily({ ...dailyExpense });
    }
  }, [dailyExpense]);

  useEffect(() => {
    if (daily.date) {
      const date = new Date(daily.date);
      setCategories(seperateActive(allCategories, date)[0]);
    }
  }, [daily.date]);

  const handleChange = (evt) => {
    setDaily({
      ...daily,
      [evt.target.name]: evt.target.value,
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchDaily({
        ...daily,
        amount: Number(daily.amount),
      })
    );
    history.goBack();
  }

  return (
    <div>
      <h1>Edit this Expense</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
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
          type="text"
          value={daily.amount}
        />
        <label htmlFor="categoryId">Category: </label>
        <select
          defaultValue={daily.categoryId}
          name="categoryId"
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option
              selected={daily.categoryId === cat.id ? 'selected' : ''}
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
