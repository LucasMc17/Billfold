import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import useToday from './custom_hooks/useToday';

/**
 * COMPONENT
 */
export default function Home() {
  const {
    username,
    income,
    deducts,
    afterDeducts,
    monthlyNet,
    expenses,
    afterExpenses,
    categories,
    fixedCats,
    unfixedCats,
    afterFixedCats,
  } = useData();
  const { month, year } = useToday();

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
      <Link to={`/year/${year}/month/${month}`}>SEE THIS MONTH</Link>
    </div>
  );
}
