import React from 'react';

export default function Insight(props) {
  const { data } = props;
  return (
    <div className="insight">
      <img
        src={
          data.suggestion === 'OVERSPENT'
            ? '/up-insight.png'
            : '/down-insight.png'
        }
      />
      <h2>
        You've {data.suggestion === 'OVERSPENT' ? 'overspent' : 'underspent'} on{' '}
        {data.name} for the past {data.lastMonths.length} months!
      </h2>
    </div>
  );
}
