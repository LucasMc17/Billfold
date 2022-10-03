import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchDeduct, fetchDeduct } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpenseDates() {
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const deduct = useSelector((state) => state.singleYearlyDeduction);

  const [de, setDe] = useState({
    name: '',
    rule: '',
    amount: null,
    percent: null,
    startMonth: 1,
    startYear: 2000,
    endMonth: 1,
    endYear: 3000,
  });

  useEffect(() => {
    dispatch(fetchDeduct(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(deduct);
    if (keys.length > 0) {
      setDe({ ...deduct, percent: deduct.percent * 100 });
    }
  }, [deduct]);

  const error =
    !de.startYear ||
    (de.endYear &&
      ((de.startYear === de.endYear && de.startMonth >= de.endMonth) ||
        de.endYear < de.startYear));

  const handleChange = (evt) => {
    const { value, name } = evt.target;
    console.log(value);
    if (name === 'start') {
      setDe({
        ...de,
        startYear: Number(value.split('-')[0]),
        startMonth: Number(value.split('-')[1]),
      });
    } else {
      setDe({
        ...de,
        endYear: Number(value.split('-')[0]),
        endMonth: Number(value.split('-')[1]),
      });
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchDeduct({
        ...de,
        percent: Number(de.percent) / 100,
        amount: Number(de.amount),
        startDate: new Date(de.startYear, de.startMonth - 1),
        endDate: de.endYear ? new Date(de.endYear, de.endMonth - 1) - 1 : null,
      })
    );
    history.push('/edit/yearly-expenses');
  }
  return (
    <div>
      <h1>Edit this Yearly Expense</h1>
      <h2>{de.name}</h2>
      <h2>{de.amount ? dollarFormat(de.amount) : `${de.percent * 100}%`}</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Active from the start of{' '}
          <input
            type="month"
            name="start"
            value={`${de.startYear}-${String(de.startMonth).padStart(2, '0')}`}
            onChange={handleChange}
          ></input>
        </p>
        <p>
          Active until the start of{' '}
          <input
            type="month"
            value={
              de.endYear
                ? `${de.endYear}-${String(de.endMonth).padStart(2, '0')}`
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
