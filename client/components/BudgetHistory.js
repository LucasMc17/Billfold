import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpenseTrack from './ExpenseTrack';
import { fetchAllCategories } from '../store';
import { useParams, Link } from 'react-router-dom';

export default function BudgetHistory() {
  const { year } = useParams();
  console.log(year);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  const categories = useSelector((state) =>
    state.allCategories.filter(
      (cat) =>
        cat.startYear <= year && (cat.endYear === null || cat.endYear >= year)
    )
  );
  const dummyIncome = [
    {
      type: 'income',
      amount: 60000,
      start: null,
      end: 3,
    },
    {
      type: 'income',
      amount: 70000,
      start: 3,
      end: null,
    },
  ];
  const dummyData = {
    name: 'STUFF',
    amount: 10000,
    percentage: null,
    start: 7,
    end: 12,
  };

  const dummyTwo = {
    name: 'THINGS',
    amount: null,
    percentage: 0.1,
    start: null,
    end: 7,
  };
  return (
    <>
      <Link to={`/budget-history/${Number(year) - 1}`}>Back</Link>
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
        </thead>
        {/* <ExpenseTrack data={dummyIncome} />
      <ExpenseTrack data={[dummyData]} />
      <ExpenseTrack data={[dummyTwo]} /> */}
        {categories.map((cat) => (
          <ExpenseTrack data={[cat]} />
        ))}
      </table>
    </>
  );
}
