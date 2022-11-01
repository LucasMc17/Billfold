import React from 'react';
import { useDispatch } from 'react-redux';
import { removeInsight, postIgnore } from '../store';

export default function Insight(props) {
  const dispatch = useDispatch();
  const { data } = props;

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

  return (
    <div
      key={data.id}
      className={data.suggestion === 'OVERSPENT' ? 'overspent' : 'underspent'}
    >
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
      <button onClick={() => handleIgnore(data)}>IGNORE</button>
    </div>
  );
}
