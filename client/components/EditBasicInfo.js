import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateUser } from '../store';
import { patchIncome } from '../store/income';

export default function EditBasicInfo() {
  const dispatch = useDispatch();
  const starterUsername = useSelector((state) => state.auth.username);
  const [username, setUsername] = useState(starterUsername);
  let history = useHistory();

  const handleNameChange = (evt) => {
    setUsername(evt.target.value);
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    if (starterUsername != username) {
      dispatch(updateUser({ username }));
    }
    history.push('/myinfo');
  }

  return (
    <div>
      <h1>Edit My Username</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          name="username"
          onChange={handleNameChange}
          type="text"
          value={username}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
