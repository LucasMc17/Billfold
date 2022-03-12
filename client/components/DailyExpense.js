import React from 'react';
import useFormatters from './custom_hooks/useFormatters';

export default function DailyExpense(props) {
  const { daily } = props;
  const { dollarFormat } = useFormatters();
  return (
    <div className="daily" key={daily.id}>
      <h3 className="dailyCat">{daily.category.name}</h3>
      <div className="dailyContents">
        <h3 className="dailyName">{daily.name}</h3>
        <p className="dailyAmount">{dollarFormat(daily.amount)}</p>
        <p className="dailyDate">
          {daily.month}/{daily.day}
        </p>
      </div>
    </div>
  );
}
