import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { Link } from 'react-router-dom';
import { drawChart, clearChart } from './PieChart';
import { updateUnassigned } from '../store';

export default function MyInfo() {
  const dispatch = useDispatch();
  const { dollarFormat, fixedDec } = useFormatters();
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
    unassigned,
  } = data;

  dispatch(updateUnassigned(unassigned));

  const pieSlices = {};
  useEffect(() => {
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
    unfixedCats.forEach(
      (cat) => (pieSlices[cat.name] = cat.percent * afterFixedCats * 12)
    );
    clearChart();
    drawChart(pieSlices);
  }, []);

  return (
    <div>
      <div className="user-story">
        <h1>Hi, my name is {username}</h1>
        <h1>I make {dollarFormat(income)} per year.</h1>
        <Link to="/edit/basic-info">
          <button type="button">Edit My Info</button>
        </Link>
        <h1>These are my yearly expenses:</h1>
        <p>
          NOTE: these expenses are calculated in order, meaning a 10% deduction
          isn't ten percent of your total income, but of your income minus all
          prior expenses
        </p>
      </div>
      <div className="user-items">
        {deducts.length ? (
          deducts.map((de) => (
            <div key={de.id}>
              <h3>{de.name}</h3>
              <p>
                {de.percent
                  ? `${de.percent * 100}% of my earnings`
                  : dollarFormat(de.amount)}
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any yearly expenses yet!</h2>
        )}
      </div>
      <Link to="/edit/yearly-expenses">
        <button type="button">Edit my Yearly Expenses</button>
      </Link>
      <div className="user-story">
        <h1>After expenses, I make {dollarFormat(afterDeducts)} a year.</h1>
        <h1>That's {dollarFormat(monthlyNet)} a month.</h1>
        <h1>These are my monthly expenses:</h1>
        <p>
          NOTE: these expenses are calculated in order, meaning a 10% deduction
          isn't ten percent of your total monthly net, but of your monthly net
          minus all prior expenses
        </p>
      </div>
      <div className="user-items">
        {expenses.length ? (
          expenses.map((ex) => (
            <div key={ex.id}>
              <h3>{ex.name}</h3>
              <p>
                {ex.percent
                  ? `${ex.percent * 100}% of my monthly net`
                  : dollarFormat(ex.amount)}
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any monthly expenses yet!</h2>
        )}
      </div>
      <Link to="/edit/monthly-expenses">
        <button type="button">Edit my Monthly Expenses</button>
      </Link>
      <div className="user-story">
        <h1>
          After those expenses, I make {dollarFormat(afterExpenses)} a month.
        </h1>
        <h1>These are my fixed spending categories each month:</h1>
      </div>
      <div className="user-items">
        {fixedCats.length ? (
          fixedCats.map((cat) => (
            <div key={cat.id}>
              <h3>{cat.name}</h3>
              <p>
                I want to spend at most {dollarFormat(cat.amount)} a month on
                this.
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any fixed spending categories yet!</h2>
        )}
      </div>
      <Link to="/edit/fixed-categories">
        <button type="button">Edit my Fixed Categories</button>
      </Link>
      <div className="user-story">
        <h1>
          That leaves me with {dollarFormat(afterFixedCats)} for my flexible
          spending categories:
        </h1>
      </div>
      <div className="user-items">
        {unfixedCats.length ? (
          unfixedCats.map((cat) => (
            <div key={cat.id}>
              <h3>{cat.name}</h3>
              <p>
                I aim to spend around {cat.percent * 100}% of my remaining money
                on this each month.
              </p>
              <p>
                That means about {dollarFormat(cat.percent * afterFixedCats)}.
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any flexible spending categories yet!</h2>
        )}
        {unassigned ? (
          <div id="unassigned-cat">
            <h3>Unassigned</h3>
            <p>
              This is an automatic category for all the money you haven't yet
              assigned.
            </p>
            <p>{`You have ${dollarFormat(unassigned)} (${
              fixedDec(unassigned / afterFixedCats) * 100
            }% of your remaining income after fixed categories) to assign.`}</p>
          </div>
        ) : (
          ''
        )}
      </div>
      <Link to="/edit/flexible-categories">
        <button type="button">Edit my Flexible Categories</button>
      </Link>
      <div className="chart-container">
        <h1>My spending:</h1>
        <div id="pie-chart" className="chart" />
      </div>
    </div>
  );
}
