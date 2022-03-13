import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDailies } from '../store';

const monthTable = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export default function AllMonths() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDailies());
  }, []);
  const dailies = useSelector((state) => state.dailyExpenses);
  function getUniqueMonths(exps) {
    const result = [];
    exps.forEach((daily) => {
      const date = `${daily.month}/${daily.year}`;
      if (!result.includes(date)) {
        result.push(date);
      }
    });
    return result;
  }
  function createObjectFormat(dates) {
    return dates
      .map((date) => ({
        date: date,
        month: Number(date.split('/')[0]),
        year: Number(date.split('/')[1]),
      }))
      .sort((a, b) => b.month - a.month)
      .sort((a, b) => b.year - a.year);
  }
  const dateList = createObjectFormat(getUniqueMonths(dailies));
  return (
    <div>
      {dateList.map((month) => (
        <div key={month.date}>
          <Link to={`/year/${month.year}/month/${month.month}`}>
            <h1>{`${monthTable[month.month]}, ${month.year}`}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
}
