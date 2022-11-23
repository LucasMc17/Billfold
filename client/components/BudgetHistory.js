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
import useFormatters from './custom_hooks/useFormatters';
import useWindowSize from './custom_hooks/useWindowSize';
const { condenseTracks } = useFormatters();

export default function BudgetHistory() {
  const { dynamicWidth } = useWindowSize();
  const monthCutoff =
    dynamicWidth > 1000 ? Infinity : dynamicWidth > 480 ? 3 : 1;
  const { year } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllIncomes());
    dispatch(fetchAllDeducts());
    dispatch(fetchAllExpenses());
  }, []);

  const today = new Date();

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
            <th>{'January'.slice(0, monthCutoff)}</th>
            <th>{'February'.slice(0, monthCutoff)}</th>
            <th>{'March'.slice(0, monthCutoff)}</th>
            <th>{'April'.slice(0, monthCutoff)}</th>
            <th>{'May'.slice(0, monthCutoff)}</th>
            <th>{'June'.slice(0, monthCutoff)}</th>
            <th>{'July'.slice(0, monthCutoff)}</th>
            <th>{'August'.slice(0, monthCutoff)}</th>
            <th>{'September'.slice(0, monthCutoff)}</th>
            <th>{'October'.slice(0, monthCutoff)}</th>
            <th>{'November'.slice(0, monthCutoff)}</th>
            <th>{'December'.slice(0, monthCutoff)}</th>
          </tr>
          <tr>
            <th colspan="12">INCOMES</th>
          </tr>
        </thead>
        {condenseTracks(incomes, Number(year)).map((inc, i) => (
          <ExpenseTrack key={i} data={inc} />
        ))}
        <thead>
          {deducts.length ? (
            <tr>
              <th colspan="12">YEARLY DEDUCTIONS</th>
            </tr>
          ) : (
            <></>
          )}
        </thead>
        {condenseTracks(deducts, Number(year)).map((de, i) => (
          <ExpenseTrack key={i} data={de} />
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
        {condenseTracks(expenses, Number(year)).map((ex, i) => (
          <ExpenseTrack key={i} data={ex} />
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
        {condenseTracks(categories, Number(year)).map((cat, i) => (
          <ExpenseTrack key={i} data={cat} />
        ))}
        {year == Number(today.getFullYear()) ? (
          <div
            id="time-marker"
            style={{
              left: `${
                today.getMonth() * 8.33333333 + today.getDate() * 0.2688172
              }%`,
            }}
          />
        ) : (
          <></>
        )}
      </table>
    </>
  );
}
