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

  const overspents = insights.filter(
    (insight) => insight.suggestion === 'OVERSPENT'
  );

  const underspents = insights.filter(
    (insight) => insight.suggestion === 'UNDERSPENT'
  );

  return insights.alert === 'NO EXTANT' ? (
    <h1>
      Your categories are all fairly new! Billfold needs time to gather data
      before we make any recommendations. Check back in a bit!
    </h1>
  ) : (
    <>
      {overspents.length ? (
        <div id="overspents">
          <p>
            These are the categories you have consistently overspent on.
            Consider allocating some extra budget to them, or reducing spending.
          </p>
          {overspents.map((insight) => (
            <Insight data={insight} key={insight.id} />
          ))}
        </div>
      ) : (
        <></>
      )}
      {underspents.length ? (
        <div id="underspents">
          <p>
            These are the categories you have consistently underspent on.
            Consider moving some of their budget to one of your other
            categories.
          </p>
          {underspents.map((insight) => (
            <Insight data={insight} key={insight.id} />
          ))}
        </div>
      ) : (
        <></>
      )}
      {insights.length ? (
        <></>
      ) : (
        <h2>
          Billfold has no recommendations for you! Keep up the good budgeting!
        </h2>
      )}
    </>
  );
}
