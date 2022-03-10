import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.username);
  const income = useSelector((state) => state.auth.income);
  const deducts = useSelector((state) => state.yearlyDeductions);
  console.log(deducts);

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <h1>YOU MAKE ${income} A YEAR</h1>
      {deducts.map((de) => (
        <div>
          {de.name} {de.rule === 'FIXED' ? de.amount : de.percent * income}
        </div>
      ))}
    </div>
  );
}
