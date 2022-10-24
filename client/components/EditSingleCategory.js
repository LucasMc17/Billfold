import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchCategory, fetchCategory } from '../store';
import { useParams, useHistory } from 'react-router-dom';
import useFormatters from './custom_hooks/useFormatters';

export default function EditSingleYearlyExpense() {
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
    changeDate: new Date(),
  });

  useEffect(() => {
    dispatch(fetchCategory(id));
  }, []);

  useEffect(() => {
    const keys = Object.keys(category);
    if (keys.length > 0) {
      setCat({
        ...category,
        percent: category.percent * 100,
        changeDate: new Date(new Date().getFullYear(), new Date().getMonth()),
      });
    }
  }, [category]);

  const handleChange = (evt) => {
    setCat({
      ...cat,
      [evt.target.name]: evt.target.value,
    });
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

  function handleDateChange(evt) {
    const { value } = evt.target;
    setCat((prevDate) => ({
      ...prevDate,
      changeDate: new Date(
        Number(value.split('-')[0]),
        Number(value.split('-')[1]) - 1,
        1
      ),
    }));
  }

  const error = cat.changeDate < new Date(cat.startYear, cat.startMonth - 1);

  return (
    <div>
      <h1>Edit this Category</h1>
      <div id="edit-form">
        <div className="edit-card">
          <p className="edit-card-header">Current category</p>
          <div className="edit-card-field">
            <p>{category.name}</p>
          </div>
          <div className="edit-card-field">
            <p>
              {category.amount
                ? dollarFormat(category.amount)
                : `${category.percent * 100}%`}
            </p>
          </div>
          <div className="edit-card-field">
            <p>
              {category.startMonth}/{category.startYear}
              {category.endMonth
                ? ` to ${category.endMonth}/${category.endYear}`
                : ' onward'}
            </p>
          </div>
        </div>
        <h1>{'>'}</h1>
        <form onSubmit={handleSubmit} className="edit-card">
          <p className="edit-card-header">Category after edits</p>
          <div className="edit-card-field">
            <input
              name="name"
              onChange={handleChange}
              type="text"
              value={cat.name}
            />
          </div>
          <div className="edit-card-field edit-card-rule">
            {cat.rule === 'FIXED' ? (
              <input
                name="amount"
                onChange={handleChange}
                type="number"
                value={`${cat.amount}`}
              />
            ) : (
              <input
                name="percent"
                max="100"
                min="1"
                onChange={handleChange}
                type="number"
                value={`${cat.percent}`}
              />
            )}
            <select name="rule" onChange={handleChange} value={cat.rule}>
              <option value="FIXED">dollars</option>
              <option value="PERCENT">percent</option>
            </select>
          </div>
          <div className="edit-card-field">
            <p>
              This change would be effective from the start of{' '}
              <input
                type="month"
                onChange={handleDateChange}
                value={`${cat.changeDate.getFullYear()}-${String(
                  cat.changeDate.getMonth() + 1
                ).padStart(2, '0')}`}
              />
              {cat.endYear
                ? ` until the start of ${cat.endMonth}/${cat.endYear}`
                : ' onward'}
            </p>
          </div>
          <button type="submit" disabled={error}>
            Save Changes
          </button>
        </form>
      </div>
      <p>
        {cat.changeDate.getMonth() + 1 === cat.startMonth &&
        cat.changeDate.getFullYear() === cat.startYear
          ? 'WARNING: This will overwrite the category'
          : ''}
      </p>
      <p>
        {error ? 'Cannot edit a category from before it went into effect!' : ''}
      </p>
    </div>
  );
}
