import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useData from './custom_hooks/useData';
import NewDailyForm from './NewDailyForm';
import DailyExpense from './DailyExpense';
import HomeChart from './HomeChart';
import getInsightGrabber from './custom_hooks/getInsights';
import {
  fetchAllCategories,
  fetchAllDeducts,
  fetchAllExpenses,
  fetchAllIncomes,
  fetchDailies,
  setInsights,
} from '../store';

/**
 * COMPONENT
 */
export default function Home() {
  const getInsights = getInsightGrabber();
  const dispatch = useDispatch();
  const dailies = useSelector((state) => state.dailyExpenses);
  const { categories, username, budgetGap, afterExpenses, onTrack } = useData();
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const tut = useSelector((state) => state.showTutorial);

  useEffect(() => {
    dispatch(fetchDailies());
    dispatch(fetchAllCategories());
    dispatch(fetchAllDeducts());
    dispatch(fetchAllExpenses());
    dispatch(fetchAllIncomes());
  }, []);

  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, [categories, dailies]);

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

  return tut ? (
    <div>
      <div id="welcome">
        <h1>Welcome back to Billfold, John Doe.</h1>
        <div id="status" className={tut === 8 ? 'tut-flag' : ''}>
          <div id="exc">!</div>
          <h2>You're roughly on track to hit your budget this month!</h2>
          {tut === 8 ? <h1 className="tut-num">1</h1> : <></>}
        </div>
        <div id="home-links">
          <Link className="nav-button" to={`/year/${year}/month/${month}`}>
            This Month
          </Link>
          <Link
            className="nav-button"
            to={`/year/${lastMonthYear}/month/${lastMonth}`}
          >
            Last Month
          </Link>
          <Link className="nav-button" to={'/all-months'}>
            All Months
          </Link>
        </div>
      </div>
      <div id="recent-purchases" className={tut === 8 ? 'tut-flag' : ''}>
        <h2>Recent purchases</h2>
        <NewDailyForm />
        <DailyExpense
          daily={{
            name: 'Dry cleaning',
            amount: 35,
            month: 12,
            day: 1,
            category: { name: 'Laundry' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'Subway home',
            amount: 2.75,
            month: 12,
            day: 2,
            category: { name: 'Subway' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'Movie',
            amount: 15,
            month: 12,
            day: 3,
            category: { name: 'Fun' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'Groceries',
            amount: 40,
            month: 12,
            day: 4,
            category: { name: 'Food' },
          }}
        />
        <DailyExpense
          daily={{
            name: 'shampoo',
            amount: 8,
            month: 12,
            day: 5,
            category: { name: 'Self care' },
          }}
        />
        {tut === 8 ? <h1 className="tut-num">2</h1> : <></>}
      </div>
      <HomeChart year={year} month={month} />
    </div>
  ) : (
    <div>
      <div id="welcome">
        <h1>Welcome back to Billfold, {username}.</h1>
        <div id="status">
          <div id="exc">!</div>
          <h2>{warning}</h2>
        </div>
        <div id="home-links">
          <Link className="nav-button" to={`/year/${year}/month/${month}`}>
            This Month
          </Link>
          <Link
            className="nav-button"
            to={`/year/${lastMonthYear}/month/${lastMonth}`}
          >
            Last Month
          </Link>
          <Link className="nav-button" to={'/all-months'}>
            All Months
          </Link>
        </div>
      </div>
      <div id="recent-purchases">
        <h2>Recent purchases</h2>
        {categories.length ? <NewDailyForm /> : <div />}
        {dailies
          .slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(Math.max(dailies.length - 5, 0))
          .map((daily) => (
            <DailyExpense key={daily.id} daily={daily} />
          ))}
      </div>
      <HomeChart year={year} month={month} afterExpenses={afterExpenses} />
    </div>
  );
}
