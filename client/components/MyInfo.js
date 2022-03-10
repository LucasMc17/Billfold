import React from 'react';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';

export default function MyInfo() {
  const { dollarFormat } = useFormatters();
  const data = useData();
  const {
    username,
    income,
    deducts,
    afterDeducts,
    monthlyNet,
    expenses,
    afterExpenses,
    fixedCats,
    afterFixedCats,
    unfixedCats,
  } = data;

  return (
    <div>
      <h1>Hi, my name is {username}</h1>
      <h1>I make {dollarFormat(income)} per year.</h1>
      <button type="button">Edit My Info</button>
      <h1>These are my yearly expenses:</h1>
      {deducts.map((de) => (
        <div key={de.id}>
          <h3>{de.name}</h3>
          <p>{de.percent ? `${de.percent * 100}% of my earnings` : ''}</p>
          <p>
            {de.percent
              ? dollarFormat(de.percent * income)
              : dollarFormat(de.amount)}
          </p>
          <button type="button">X</button>
        </div>
      ))}
      <button type="button">Add a Yearly Expense</button>
      <h1>After expenses, I make {dollarFormat(afterDeducts)} a year.</h1>
      <h1>That's {dollarFormat(monthlyNet)} a month.</h1>
      <h1>These are my monthly expenses:</h1>
      {expenses.map((ex) => (
        <div key={ex.id}>
          <h3>{ex.name}</h3>
          <p>{ex.percent ? `${ex.percent * 100}% of my monthly net` : ''}</p>
          <p>
            {ex.percent
              ? dollarFormat(ex.percent * income)
              : dollarFormat(ex.amount)}
          </p>
          <button type="button">X</button>
        </div>
      ))}
      <button type="button">Add a Monthly Expense</button>
      <h1>
        After those expenses, I make {dollarFormat(afterExpenses)} a month.
      </h1>
      <h1>These are my fixed spending categories each month:</h1>
      {fixedCats.map((cat) => (
        <div key={cat.id}>
          <h3>{cat.name}</h3>
          <p>
            I want to spend at most {dollarFormat(cat.amount)} a month on this.
          </p>
          <button type="button">X</button>
        </div>
      ))}
      <button type="button">Add a Fixed Category</button>
      <h1>
        That leaves me with {dollarFormat(afterFixedCats)} for my flexible
        spending categories:
      </h1>
      {unfixedCats.map((cat) => (
        <div key={cat.id}>
          <h3>{cat.name}</h3>
          <p>
            I aim to spend around {cat.percent * 100}% of my remaining money on
            this each month.
          </p>
          <p>That means about {dollarFormat(cat.percent * afterFixedCats)}.</p>
          <button type="button">X</button>
        </div>
      ))}
      <button type="button">Add a Flexible Category</button>
    </div>
  );
}
