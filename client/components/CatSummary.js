import React from 'react';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';

export default function CatSummary(props) {
  const { dollarFormat, fixedDec } = useFormatters();
  const data = useData(new Date(props.year, props.month - 1, 15));
  const { cat } = props;
  const dailies = data.dailies.filter(
    (daily) =>
      daily.category &&
      daily.category.name === cat.name &&
      daily.month === Number(props.month) &&
      daily.year === Number(props.year)
  );

  const budget = cat.amount ? cat.amount : cat.percent * data.afterFixedCats;
  const spent = dailies
    .filter((daily) => daily.category.name === cat.name)
    .reduce((acc, daily) => acc + daily.amount, 0);
  const percentSpent = (spent / budget) * 100;

  return (
    <div>
      <h2>{cat.name}</h2>
      <h3>BUDGET: {dollarFormat(budget)}</h3>
      <h3 className={percentSpent > 100 ? 'warning' : ''}>
        SPENT: {dollarFormat(spent)}
      </h3>
      <h3 className={percentSpent > 100 ? 'warning' : ''}>
        {fixedDec(percentSpent)}%
      </h3>
    </div>
  );
}
