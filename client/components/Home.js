import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.username);
  const income = useSelector((state) => state.auth.income);

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <h1>YOU MAKE ${income} A YEAR</h1>
    </div>
  );
}
