import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateUser } from '../store';
import { patchIncome } from '../store/income';

export default function EditBasicInfo() {
  const dispatch = useDispatch();
  const starterUsername = useSelector((state) => state.auth.username);
  const starterIncome = useSelector((state) => state.income);
  const [username, setUsername] = useState(starterUsername);
  const [income, setIncome] = useState(starterIncome);
  let history = useHistory();

  const handleNameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handleIncomeChange = (evt) => {
    setIncome(evt.target.value);
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    if (starterIncome != income) {
      dispatch(patchIncome({ income }));
    }
    if (starterUsername != username) {
      dispatch(updateUser({ username }));
    }
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
