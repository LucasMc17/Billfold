import React, { useEffect } from 'react';
import Insight from './Insight';
import { useSelector, useDispatch } from 'react-redux';

import getInsightGrabber from './custom_hooks/getInsights';
import useFormatters from './custom_hooks/useFormatters';
import { setInsights } from '../store';

export default function BillfoldInsights() {
  const dispatch = useDispatch();
  const { fixedDec } = useFormatters();
  const getInsights = getInsightGrabber();
  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, []);
  const insights = useSelector((state) => state.insights);
  const { recommendations } = insights;

  const overspents = recommendations.filter(
    (insight) => insight.suggestion === 'OVERSPENT'
  );

  const underspents = recommendations.filter(
    (insight) => insight.suggestion === 'UNDERSPENT'
  );

  return (
    <>
      <div id="suggestions">
        {insights.alert === 'NO EXTANT' ? (
          <h1>
            Your categories are all fairly new! Billfold needs time to gather
            data before we make any recommendations. Check back in a bit!
          </h1>
        ) : (
          <>
            {overspents.length ? (
              <div id="overspents">
                <p>
                  These are the categories you have consistently overspent on.
                  Consider allocating some extra budget to them, or reducing
                  spending.
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
            {recommendations.length ? (
              <></>
            ) : (
              <h2>
                Billfold has no recommendations for you! Keep up the good
                budgeting!
              </h2>
            )}
          </>
        )}
      </div>
      <div id="averages">
        <p>
          These are your spending averages for all of your active categories.
        </p>
        <div id="average-box">
          {insights.averages.map((avg) => (
            <div
              className={`cat-average${
                avg.avg > 100
                  ? ' over-average'
                  : avg.avg <= 95
                  ? ' under-average'
                  : ''
              }`}
            >
              <h2>{avg.name}</h2>
              <h4>Months Active</h4>
              <h3>{avg.monthsActive}</h3>
              <h4>Average Percentage Spent</h4>
              <h3>{fixedDec(avg.avg)}%</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
