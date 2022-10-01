import React from 'react';
import { useParams } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

const { dollarFormat } = useFormatters();

export default function ExpenseTrack(props) {
  const { data } = props;
  const year = Number(useParams().year);
  function getEnds(sm, sy, em, ey) {
    let start = 0;
    if (sy === year) {
      start = (100 / 12) * (sm - 1) + 0.2;
    }
    let end = 100;
    if (ey === year) {
      end = (100 / 12) * (em - 1) - 0.2;
    }
    return [start, end];
  }
  return (
    <>
      <tr className="expense-track">
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        <td className="track-month" />
        {data.map((datum, i) => {
          const [left, right] = getEnds(
            datum.startMonth,
            datum.startYear,
            datum.endMonth,
            datum.endYear
          );
          const leftRadius = datum.startYear === year ? '15px' : '0';
          const rightRadius =
            (datum.endYear === year + 1 && datum.endMonth === 1) ||
            datum.endYear === year
              ? '15px'
              : '0';
          return (
            <td
              key={i}
              className="expense-on-track"
              style={{
                left: `${left}%`,
                width: `calc(${right - left}% - 2px)`,
                borderRadius: `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`,
              }}
            >
              <h3>{datum.name || `${dollarFormat(datum.amount)} per year`}</h3>
              <p>
                {datum.name ? (
                  datum.amount ? (
                    dollarFormat(datum.amount)
                  ) : (
                    `${datum.percent * 100}%`
                  )
                ) : (
                  <></>
                )}
              </p>
              <p>
                {datum.startMonth}/{datum.startYear}
                {datum.endMonth
                  ? ` - ${datum.endMonth}/${datum.endYear}`
                  : ' onward'}
              </p>
            </td>
          );
        })}
      </tr>
    </>
  );
}
