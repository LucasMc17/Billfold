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
  const afterDeducts =
    income -
    deducts.reduce((acc, de) => acc + (de.amount || de.percent * income), 0);
  const monthlyNet = afterDeducts / 12;
  const expenses = useSelector((state) => state.monthlyExpenses);
  const afterExpenses =
    monthlyNet -
    expenses.reduce(
      (acc, ex) => acc + (ex.amount || ex.percent * monthlyNet),
      0
    );

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <h1>YOU MAKE ${income} A YEAR</h1>
      {deducts.map((de) => (
        <div key={de.id}>
          {de.name} {de.rule === 'FIXED' ? de.amount : de.percent * income}
        </div>
      ))}
      <div>income after expenses: {afterDeducts}</div>
      <div>per month: {monthlyNet}</div>
      {expenses.map((ex) => (
        <div key={ex.id}>
          {ex.name} {ex.rule === 'FIXED' ? ex.amount : ex.percent * monthlyNet}
        </div>
      ))}
      <div>per month after expenses: {afterExpenses}</div>
    </div>
  );
}
