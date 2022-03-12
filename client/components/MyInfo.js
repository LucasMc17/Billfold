import React, { useEffect } from 'react';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { useDispatch } from 'react-redux';
import {
  fetchDailies,
  fetchExpenses,
  fetchDeducts,
  fetchCategories,
  me,
} from '../store';
import { Link } from 'react-router-dom';
import { drawChart, clearChart } from './PieChart';
import { pie } from 'd3';

export default function MyInfo() {
  const dispatch = useDispatch();
  const { dollarFormat } = useFormatters();
  useEffect(() => {
    dispatch(me());
    dispatch(fetchExpenses());
    dispatch(fetchDeducts());
    dispatch(fetchCategories());
    dispatch(fetchDailies());
  }, []);
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

  const pieSlices = {};
  deducts.forEach((de) =>
    de.amount
      ? (pieSlices[de.name] = de.amount)
      : (pieSlices[de.name] = de.percent * income)
  );
  expenses.forEach((ex) =>
    ex.amount
      ? (pieSlices[ex.name] = ex.amount * 12)
      : (pieSlices[ex.name] = ex.percent * monthlyNet * 12)
  );
  fixedCats.forEach((cat) => (pieSlices[cat.name] = cat.amount * 12));
  unfixedCats.forEach((cat) => (pieSlices[cat.name] = cat.percent * 100 * 12));
  clearChart();
  drawChart(pieSlices);

  return (
    <div>
      <h1>Hi, my name is {username}</h1>
      <h1>I make {dollarFormat(income)} per year.</h1>
      <Link to="/edit/basic-info">
        <button type="button">Edit My Info</button>
      </Link>
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
        </div>
      ))}
      <Link to="/edit/yearly-expenses">
        <button type="button">Edit my Yearly Expenses</button>
      </Link>
      <h1>After expenses, I make {dollarFormat(afterDeducts)} a year.</h1>
      <h1>That's {dollarFormat(monthlyNet)} a month.</h1>
      <h1>These are my monthly expenses:</h1>
      {expenses.map((ex) => (
        <div key={ex.id}>
          <h3>{ex.name}</h3>
          <p>{ex.percent ? `${ex.percent * 100}% of my monthly net` : ''}</p>
          <p>
            {ex.percent
              ? dollarFormat(ex.percent * monthlyNet)
              : dollarFormat(ex.amount)}
          </p>
        </div>
      ))}
      <Link to="/edit/monthly-expenses">
        <button type="button">Edit my Monthly Expenses</button>
      </Link>
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
        </div>
      ))}
      <Link to="/edit/fixed-categories">
        <button type="button">Edit my Fixed Categories</button>
      </Link>
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
        </div>
      ))}
      <Link to="/edit/flexible-categories">
        <button type="button">Edit my Flexible Categories</button>
      </Link>
      {[...Object.keys(pieSlices)].length ? (
        <div>
          <h1>My spending:</h1>
          <div id="pie-chart" />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
