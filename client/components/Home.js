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
  const categories = useSelector((state) => state.categories);
  const fixedCats = categories.filter((cat) => cat.rule === 'FIXED');
  const afterFixedCats =
    afterExpenses - fixedCats.reduce((acc, cat) => acc + cat.amount, 0);
  const unfixedCats = categories.filter((cat) => cat.rule === 'PERCENT');

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
      <div>
        Your fixed expense categories:{' '}
        {fixedCats.map((cat) => `${cat.name}: $${cat.amount}`).join(', ')}
      </div>
      <div>Your monthly income after fixed expenses: ${afterFixedCats}</div>
      <div>
        Your percentage expense categories:{' '}
        {unfixedCats
          .map(
            (cat) =>
              `${cat.name}: ${cat.percent * 100}% / $${
                afterFixedCats * cat.percent
              }`
          )
          .join(', ')}
      </div>
      <p>{new Date().getFullYear()}</p>
    </div>
  );
}
