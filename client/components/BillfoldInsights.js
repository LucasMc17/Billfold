import React from 'react';
import Insight from './Insight';
import { useSelector } from 'react-redux';

// const year = today.getFullYear();

export default function BillfoldInsights() {
  const insights = useSelector((state) => state.insights);
  return (
    <>
      <div>
        <p>
          These are the categories you have consistently overspent on. Consider
          allocating some extra budget to them, or reducing spending.
        </p>
        {insights
          .filter((insight) => insight.suggestion === 'OVERSPENT')
          .map((insight) => (
            <Insight data={insight} />
          ))}
      </div>
      <div>
        <p>
          These are the categories you have consistently underspent on. Consider
          moving some of their budget to one of your other categories.
        </p>
        {insights
          .filter((insight) => insight.suggestion === 'UNDERSPENT')
          .map((insight) => (
            <Insight data={insight} />
          ))}
      </div>
    </>
  );
}
