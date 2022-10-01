import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpenseTrack from './ExpenseTrack';
import {
  fetchAllCategories,
  fetchAllIncomes,
  fetchAllDeducts,
  fetchAllExpenses,
} from '../store';
import { useParams, Link } from 'react-router-dom';

export default function BudgetHistory() {
  const { year } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllIncomes());
    dispatch(fetchAllDeducts());
    dispatch(fetchAllExpenses());
  }, []);

  const categories = useSelector((state) =>
    state.allCategories.filter(
      (cat) =>
        cat.startYear <= year &&
        (cat.endYear === null || cat.endYear >= year) &&
        !(cat.endYear == year && cat.endMonth === 1)
    )
  );

  const incomes = useSelector((state) =>
    state.allIncomes.filter(
      (income) =>
        income.startYear <= year &&
        (income.endYear === null || income.endYear >= year) &&
        !(income.endYear == year && income.endMonth === 1)
    )
  );

  const deducts = useSelector((state) =>
    state.allDeducts.filter(
      (de) =>
        de.startYear <= year &&
        (de.endYear === null || de.endYear >= year) &&
        !(de.endYear == year && de.endMonth === 1)
    )
  );

  const expenses = useSelector((state) =>
    state.allExpenses.filter(
      (ex) =>
        ex.startYear <= year &&
        (ex.endYear === null || ex.endYear >= year) &&
        !(ex.endYear == year && ex.endMonth === 1)
    )
  );

  return (
    <>
      <div id="budget-history-header">
        <Link to={`/budget-history/${Number(year) - 1}`}>
          <h1 className="arrow">{'<<'}</h1>
        </Link>
        <h1>{year}</h1>
        <Link to={`/budget-history/${Number(year) + 1}`}>
          <h1 className="arrow">{'>>'}</h1>
        </Link>
      </div>
      <table className="history-section">
        <thead>
          <tr>
            <th>January</th>
            <th>February</th>
            <th>March</th>
            <th>April</th>
            <th>May</th>
            <th>June</th>
            <th>July</th>
            <th>August</th>
            <th>September</th>
            <th>October</th>
            <th>November</th>
            <th>December</th>
          </tr>
          <tr>
            <th colspan="12">INCOMES</th>
          </tr>
        </thead>
        <ExpenseTrack income={true} data={incomes} />
        <thead>
          {deducts.length ? (
            <tr>
              <th colspan="12">YEARLY DEDUCTIONS</th>
            </tr>
          ) : (
            <></>
          )}
        </thead>
        {deducts.map((de, i) => (
          <ExpenseTrack key={i} data={[de]} />
        ))}
        <thead>
          {expenses.length ? (
            <tr>
              <th colspan="12">MONTHLY EXPENSES</th>
            </tr>
          ) : (
            <></>
          )}
        </thead>
        {expenses.map((ex, i) => (
          <ExpenseTrack key={i} data={[ex]} />
        ))}
        <thead>
          {categories.length ? (
            <tr>
              <th colspan="12">CATEGORIES</th>
            </tr>
          ) : (
            <></>
          )}
        </thead>
        {categories.map((cat, i) => (
          <ExpenseTrack key={i} data={[cat]} />
        ))}
      </table>
    </>
  );
}
