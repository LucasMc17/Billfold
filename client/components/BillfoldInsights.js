import React, { useEffect } from 'react';
import Insight from './Insight';
import { useSelector, useDispatch } from 'react-redux';

import getInsightGrabber from './custom_hooks/getInsights';
import { setInsights } from '../store';

export default function BillfoldInsights() {
  const dispatch = useDispatch();
  const getInsights = getInsightGrabber();
  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, []);
  const insights = useSelector((state) => state.insights);
  return (
    <>
      <div id="overspents">
        <p>
          These are the categories you have consistently overspent on. Consider
          allocating some extra budget to them, or reducing spending.
        </p>
        {insights
          .filter((insight) => insight.suggestion === 'OVERSPENT')
          .map((insight) => (
            <Insight data={insight} key={insight.id} />
          ))}
      </div>
      <div id="underspents">
        <p>
          These are the categories you have consistently underspent on. Consider
          moving some of their budget to one of your other categories.
        </p>
        {insights
          .filter((insight) => insight.suggestion === 'UNDERSPENT')
          .map((insight) => (
            <Insight data={insight} key={insight.id} />
          ))}
      </div>
    </>
  );
}
