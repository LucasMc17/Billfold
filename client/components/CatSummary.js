import React from 'react';
import useData from './custom_hooks/useData';

export default function CatSummary(props) {
  const data = useData();
  const { cat } = props;
  const dailies = data.dailies.filter(
    (daily) =>
      daily.category.name === cat.name && daily.month === Number(props.month)
  );

  const budget = cat.amount ? cat.amount : cat.percent * data.afterFixedCats;
  const spent = dailies
    .filter((daily) => daily.category.name === cat.name)
    .reduce((acc, daily) => acc + daily.amount, 0);
  const percentSpent = (spent / budget) * 100;

  return (
    <div>
      <h2>{cat.name}</h2>
      <h3>
        BUDGET PER MONTH: 
        {budget.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </h3>
      <p>
        AMOUNT SPENT THIS MONTH: ${spent} / {percentSpent}%
      </p>
    </div>
  );
}
