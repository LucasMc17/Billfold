import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
  const dailies = useSelector((state) => state.dailyExpenses);
  function getUniqueMonths(exps) {
    const result = {};
    exps.forEach((daily) => {
      if (!result[daily.year]) {
        result[daily.year] = [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ];
      }
      if (!result[daily.year][daily.month - 1]) {
        result[daily.year][daily.month - 1] = true;
      }
    });
    return result;
  }
  console.log(getUniqueMonths(dailies));
  // function createObjectFormat(dates) {
  //   Object.keys(dates).forEach(year => {
  //     dates[year].map(month => {
  //       return {
  //         month:
  //       }
  //     })
  //   })
  // }
  const dateList = getUniqueMonths(dailies);
  return (
    <div id="year-list">
      {Object.keys(dateList).reverse().map((year) => (
        <div className="year" key={year}>
          <h1>{year}</h1>
          <div className="month-chart">
            {dateList[year].map((month, i) => {
              return month ? (
                <div className="month">
                  <Link to={`/year/${year}/month/${i + 1}`}>
                    <h1>{`${monthTable[i + 1]}`}</h1>
                  </Link>
                </div>
              ) : (
                <div className="month no-dailies">
                  <h1>{`${monthTable[i + 1]}`}</h1>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
