import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeInsight, postIgnore } from '../store';
import useFormatters from './custom_hooks/useFormatters';
const currMonth = new Date().getMonth();

export default function Insight(props) {
  const dispatch = useDispatch();
  const { data } = props;
  const [detailed, setDetailed] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const { dollarFormat, fixedDec } = useFormatters();

  function handleIgnore(ins) {
    dispatch(removeInsight(ins.id));
    dispatch(
      postIgnore({
        catName: ins.name,
        suggestion: ins.suggestion,
        ignoredDate: new Date(),
      })
    );
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div
      className={data.suggestion === 'OVERSPENT' ? 'overspent' : 'underspent'}
    >
      <div className="insight-flex">
        <div className="insight-headline">
          <img
            src={
              data.suggestion === 'OVERSPENT'
                ? '/up-insight.png'
                : '/down-insight.png'
            }
          />
          <h2>
            You've{' '}
            {data.suggestion === 'OVERSPENT' ? 'overspent' : 'underspent'} on{' '}
            {data.name} for the past {data.lastMonths.length} months!
          </h2>
        </div>
        <div className="insight-buttons">
          <button onClick={() => setDetailed((prevDetailed) => !prevDetailed)}>
            {detailed ? 'HIDE DETAILS' : 'SHOW DETAILS'}
          </button>
          <button onClick={() => handleIgnore(data)}>IGNORE</button>
          <div
            className="question"
            onMouseOver={() => setExplaining(true)}
            onMouseOut={() => setExplaining(false)}
          >
            ?
          </div>
          {explaining ? (
            <div className="explanation">
              Clicking 'ignore' will block this insight for one month
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {detailed ? (
        <div>
          <table className="insight-details">
            <thead>
              <tr>
                <th>Month</th>
                <th>Budget</th>
                <th>Dollars Spent</th>
                <th>Percent Spent</th>
              </tr>
            </thead>
            <tbody>
              {data.lastMonths.map((month, i) => (
                <tr key={i}>
                  <td>
                    {months[currMonth - 1 - i] ||
                      months[11 - (i - (currMonth % 12))]}
                  </td>
                  <td>{dollarFormat(month.budget)}</td>
                  <td>{dollarFormat(month.spent)}</td>
                  <td>{`${fixedDec(month.ratio * 100)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>
            Based on this data, you{' '}
            {data.suggestion === 'UNDERSPENT'
              ? `can safely reallocate ${dollarFormat(
                  data.lastMonths[0].budget -
                    Math.max(...data.lastMonths.map((month) => month.spent))
                )} from `
              : `should consider adding about ${dollarFormat(
                  Math.max(...data.lastMonths.map((month) => month.spent)) -
                    data.lastMonths[0].budget
                )} to`}{' '}
            this category.
          </h3>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
