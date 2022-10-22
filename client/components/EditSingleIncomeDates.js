import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchIncome, fetchSingleIncome } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleIncomeDates() {
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const income = useSelector((state) => state.singleIncome);

  const [inc, setInc] = useState({
    amount: 0,
    startMonth: 1,
    startYear: 2000,
    endMonth: 1,
    endYear: 3000,
  });

  useEffect(() => {
    dispatch(fetchSingleIncome(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(income);
    if (keys.length > 0) {
      setInc({ ...income });
    }
  }, [income]);

  const error =
    !inc.startYear ||
    (inc.endYear &&
      ((inc.startYear === inc.endYear && inc.startMonth >= inc.endMonth) ||
        inc.endYear < inc.startYear));

  const handleChange = (evt) => {
    const { value, name } = evt.target;
    if (name === 'start') {
      if (value) {
        setInc({
          ...inc,
          startYear: Number(value.split('-')[0]),
          startMonth: Number(value.split('-')[1]),
        });
      } else {
        setInc({
          ...inc,
          startYear: null,
          startMonth: null,
        });
      }
    } else {
      if (value) {
        setInc({
          ...inc,
          endYear: Number(value.split('-')[0]),
          endMonth: Number(value.split('-')[1]),
        });
      } else {
        setInc({
          ...inc,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchIncome({
        ...inc,
        amount: Number(inc.amount),
      })
    );
    history.push('/edit/incomes');
  }
  return (
    <div>
      <h1>Edit this Income</h1>
      <h2>{dollarFormat(inc.amount)}</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Active from the start of{' '}
          <input
            type="month"
            name="start"
            value={`${inc.startYear}-${String(inc.startMonth).padStart(
              2,
              '0'
            )}`}
            onChange={handleChange}
          ></input>
        </p>
        <p>
          Active until the start of{' '}
          <input
            type="month"
            value={
              inc.endYear
                ? `${inc.endYear}-${String(inc.endMonth).padStart(2, '0')}`
                : ''
            }
            onChange={handleChange}
          ></input>{' '}
          (leave blank if ongoing)
        </p>
        <button disabled={error} type="submit">
          Save Changes
        </button>
      </form>
      <h1>{error ? 'NO WAY JOSE' : ''}</h1>
    </div>
  );
}
