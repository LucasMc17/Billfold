import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchCategory, fetchCategory } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpenseDates() {
  const { dollarFormat } = useFormatters();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const category = useSelector((state) => state.singleCategory);

  const [cat, setCat] = useState({
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
    dispatch(fetchCategory(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(category);
    if (keys.length > 0) {
      setCat({ ...category, percent: category.percent * 100 });
    }
  }, [category]);

  const error =
    !cat.startYear ||
    (cat.endYear &&
      ((cat.startYear === cat.endYear && cat.startMonth >= cat.endMonth) ||
        cat.endYear < cat.startYear));

  const handleChange = (evt) => {
    const { value, name } = evt.target;
    if (name === 'start') {
      if (value) {
        setCat({
          ...cat,
          startYear: Number(value.split('-')[0]),
          startMonth: Number(value.split('-')[1]),
        });
      } else {
        setCat({
          ...cat,
          startYear: null,
          startMonth: null,
        });
      }
    } else {
      if (value) {
        setCat({
          ...cat,
          endYear: Number(value.split('-')[0]),
          endMonth: Number(value.split('-')[1]),
        });
      } else {
        setCat({
          ...cat,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      patchCategory({
        ...cat,
        percent: Number(cat.percent) / 100,
        amount: Number(cat.amount),
      })
    );
    if (cat.rule === 'FIXED') {
      history.push('/edit/fixed-categories');
    } else {
      history.push('/edit/flexible-categories');
    }
  }
  return (
    <div>
      <h1>Edit this Category</h1>
      <h2>{cat.name}</h2>
      <h2>{cat.amount ? dollarFormat(cat.amount) : `${cat.percent}%`}</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Active from the start of{' '}
          <input
            type="month"
            name="start"
            value={`${cat.startYear}-${String(cat.startMonth).padStart(
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
              cat.endYear
                ? `${cat.endYear}-${String(cat.endMonth).padStart(2, '0')}`
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
