import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateUser, postBudget } from '../store';
import useData from './custom_hooks/useData';

export default function EditBasicInfo() {
  const dispatch = useDispatch();
  const data = useData();
  const [username, setUsername] = useState(data.username);
  const [income, setIncome] = useState(data.income);
  let history = useHistory();

  const handleNameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handleIncomeChange = (evt) => {
    setIncome(evt.target.value);
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(updateUser({ username, income: Number(income) }));
    dispatch(postBudget({ income: Number(income) }));
    history.push('/myinfo');
  }

  return (
    <div>
      <h1>Edit Basic Info</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          name="username"
          onChange={handleNameChange}
          type="text"
          value={username}
        />
        <label htmlFor="income">Income: </label>
        <input
          name="income"
          onChange={handleIncomeChange}
          type="number"
          value={income}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
