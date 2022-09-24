import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import NewDailyForm from './NewDailyForm';
import DailyExpense from './DailyExpense';
import HomeChart from './HomeChart';
import {
  fetchCategories,
  fetchDailies,
  fetchExpenses,
  fetchDeducts,
} from '../store';
import { fetchIncome } from '../store/income';

/**
 * COMPONENT
 */
export default function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const dailies = useSelector((state) => state.dailyExpenses);
  const { username, budgetGap, afterExpenses, unassigned, onTrack } = useData();
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  useEffect(() => {
    dispatch(fetchDeducts(year, month - 1));
    dispatch(fetchExpenses(year, month - 1));
    dispatch(fetchCategories(year, month - 1));
    dispatch(fetchDailies());
    dispatch(fetchIncome(year, month - 1));
  }, []);

  let lastMonthYear, lastMonth;
  if (month === 1) {
    lastMonthYear = year - 1;
    lastMonth = 12;
  } else {
    lastMonthYear = year;
    lastMonth = month - 1;
  }
  let warning;
  if (budgetGap > 1.1) {
    warning = `You're significantly over budget this month!`;
  } else if (budgetGap > 1) {
    warning = `You're a little bit over budget this month!`;
  } else if (budgetGap > 0.9) {
    warning = `You're almost at your budget this month!`;
  } else if (budgetGap <= -100) {
    warning = `You're significantly over budget this month!`;
  } else if (onTrack > -0.1 && onTrack < 0.1) {
    warning = `You're roughly on track to hit your budget this month!`;
  } else if (onTrack > 0) {
    warning = `You're trending over budget this month!`;
  } else {
    warning = `You're trending under budget so far this month!`;
  }

  return (
    <div>
      <div id="welcome">
        <h1>Welcome back to Billfold, {username}.</h1>
        <div id="status">
          <div id="exc">!</div>
          <h2>{warning}</h2>
        </div>
        <div id="home-links">
          <Link class="nav-button" to={`/year/${year}/month/${month}`}>
            This Month
          </Link>
          <Link
            class="nav-button"
            to={`/year/${lastMonthYear}/month/${lastMonth}`}
          >
            Last Month
          </Link>
          <Link class="nav-button" to={'/all-months'}>
            All Months
          </Link>
        </div>
      </div>
      <div id="recent-purchases">
        <h2>Recent purchases</h2>
        {dailies
          .slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(Math.max(dailies.length - 5, 0))
          .map((daily) => (
            <DailyExpense key={daily.id} daily={daily} />
          ))}
        {categories.length ? <NewDailyForm /> : <div />}
      </div>
      <HomeChart year={year} month={month} afterExpenses={afterExpenses} />
    </div>
  );
}
